const { join, extname, basename, sep, posix, dirname } = require('path');
const { readdir, lstat, access } = require('fs/promises');
const sharp = require('sharp');

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

// Find and return the path of the Base. image file
module.exports.getBaseImage = async function getBaseImage(directory) {
  try {
    let files = await readdir(directory);
    for (let file of files) {
        let imagePath = join(directory, file);
        let extension = extname(file);
        // Look for file named Base with one of the allowed extensions
        if ((await lstat(imagePath)).isFile() && basename(file, extension) === 'Base') {
            if (allowedExtensions.includes(extension)) {
              return imagePath;
            }
        }
    }
  } catch (err) {
      console.error(err);
  }
  // Throw error if no base image is found
  throw new Error(`No base image found in ${directory}`);
};

// Load all images in a layer folder, and generate thumbnail versions if they do not yet exist
module.exports.loadImages = async function loadImages(layerPath) {
  let images = [];
  try {
      let files = await readdir(layerPath);
      // Get all images in folder
      for (let file of files) {
          let imagePath = join(layerPath, file);
          if ((await lstat(imagePath)).isFile()) {
            let name = basename(file, extname(file));
            if (!name.endsWith('_thumbnail')) {
              let thumbnail = join(dirname(imagePath), `${name}_thumbnail.png`);
              // check if the thumbnail exists
              try {
                await access(thumbnail);
              } catch {
                // create missing thumbnail
                await createThumbnail(imagePath);
              }
              images.push({
                path: imagePath,
                previewPath: '"image://' + thumbnail.split(sep).join(posix.sep) + '"',
                overlayPath: '"image://' + imagePath.split(sep).join(posix.sep) + '"',
                name: name
              });
            }
          }
      }
  } catch (err) {
    console.error(err);
  }
  return images;
};

// Trims away all the empty pixels in an image and returns a small thumbnail
async function createThumbnail(imagePath) {
  return await sharp(imagePath)
    .trim()
    .toFile(join(dirname(imagePath), `${basename(imagePath, extname(imagePath))}_thumbnail.png`));
}

// Create single image from selection of layers
module.exports.generateComposite = async function generateComposite(base, layers, savePath, filetype = 'jpeg') {
  // Get Buffer data from all layers
  const data = await Promise.all(layers.map(layer => sharp(layer).toBuffer()));
  // Map to proper input format
  const files = data.map(buffer => ({input: buffer}));
  // Load base Image
  let composite = sharp(base);
  if (layers.length > 0) {
    // Generate composite images with all the layers
    composite.composite(files);
  }
  // Output in selected filetype, default jpeg
  if (filetype === 'png') {
    composite.png();
  } else if (filetype === 'webp') {
    composite.webp({ quality: 100 })
  }
  else {
    filetype = 'jpeg'
    composite.jpeg({
      quality: 100,
      mozjpeg: true
    });
  }
  composite.toFile(`${savePath}.${filetype}`);
  // Run composite code
  return await composite;
}