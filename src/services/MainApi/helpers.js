const { join, extname, basename, sep, posix, dirname } = require('path');
const { readdir, lstat } = require('fs/promises');
const sharp = require('sharp');
const fs = require('fs');

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

// Find and return the path of the Base. image file
module.exports.getBaseImage = async function getBaseImage (directory) {
    try {
        const files = await readdir(directory);
        for (const file of files) {
            const imagePath = join(directory, file);
            const extension = extname(file);
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
module.exports.loadImages = async function loadImages (layerPath) {
    const images = [];
    try {
        const files = await readdir(layerPath);
        // Get all images in folder
        for (const file of files) {
            const imagePath = join(layerPath, file);
            if ((await lstat(imagePath)).isFile()) {
                const name = basename(file, extname(file));
                if (!name.endsWith('_thumbnail')) {
                    const thumbnail = join(dirname(imagePath), `${name}_thumbnail.png`);
                    // check if the thumbnail exists
                    if (!(await fileExists(thumbnail))) {
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
async function createThumbnail (imagePath) {
    return await sharp(imagePath)
        .trim()
        .toFile(join(dirname(imagePath), `${basename(imagePath, extname(imagePath))}_thumbnail.png`));
}

// Create single image from selection of layers
module.exports.generateComposite = async function generateComposite (base, layers, savePath, filetype = 'jpeg') {
    // Get Buffer data from all layers
    const data = await Promise.all(layers.map(layer => sharp(layer).toBuffer()));
    // Map to proper input format
    const files = data.map(buffer => ({ input: buffer }));
    // Load base Image
    const composite = sharp(base);

    // Get image size
    const metadata = await composite.metadata();
    const width = metadata.width;
    const height = metadata.height;

    // create watermark
    let watermark = sharp(join(__dirname, '..', '..', 'assets', 'watermark.png'));
    if (width > height) {
        watermark.resize({ height: Math.floor(height * 0.2) });
    } else {
        watermark.resize({ width: Math.floor(width * 0.2) });
    }
    watermark = await watermark.toBuffer();
    files.push({
        input: watermark,
        gravity: 'southeast'
    });
    // Generate composite images with all the layers
    composite.composite(files);
    // Output in selected filetype, default jpeg
    if (filetype === 'png') {
        composite.png();
    } else if (filetype === 'webp') {
        composite.webp({ quality: 100 });
    } else {
        filetype = 'jpeg';
        composite.jpeg({
            quality: 100,
            mozjpeg: true
        });
    }
    await composite.toFile(`${savePath}.${filetype}`);
    // Run composite code
    // return await composite;
};

// Return boolean if file or directory exists
async function fileExists (file) {
    return new Promise((resolve) => {
        fs.access(file, fs.constants.F_OK, (err) => {
            err ? resolve(false) : resolve(true);
        });
    });
}

module.exports.fileExists = fileExists;
