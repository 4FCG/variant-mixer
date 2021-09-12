const listPackages = require('./listPackages/listPackages');
const loadPackages = require('./loadPackages/loadPackages');
const exportImage = require('./exportImage/exportImage');
const exportQueue = require('./exportQueue/exportQueue');
const importPackage = require('./importPackage/importPackage');
const deletePackage = require('./deletePackage/deletePackage');
const restartApp = require('./restartApp/restartApp');

module.exports = [listPackages, loadPackages, exportImage, exportQueue, importPackage, deletePackage, restartApp];