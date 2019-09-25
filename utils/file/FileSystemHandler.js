const fs = require('fs');
const path = require('path');

const AsyncFormidable = require('./AsyncFormidable');

class FileSystemHandler {

  static getUploadDirectory() {
    return path.join(__dirname, '../../', '/documents/');
  }

  /**
   * Extract file informations from request
   * @param {request} req: the HTTP request
   * @returns {Promise<object>}
   * fields: the document that was sent
   * files: the informations on the document file
   */
  static async parseFileInfosFrom(req) {
    const uploadDir = FileSystemHandler.getUploadDirectory();

    return AsyncFormidable.for(req, uploadDir);
  }

  static async moveFile(origin, fileName) {
    const root = FileSystemHandler.getUploadDirectory();
    const destination = path.join(root, fileName);

    return new Promise((resolve, reject) => {
      fs.rename(origin, destination, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  static async unlink(fileName) {
    const root = FileSystemHandler.getUploadDirectory();
    const fileLocation = path.join(root, fileName);

    return new Promise((resolve, reject) => {
      fs.unlink(fileLocation, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}

module.exports = { FileSystemHandler };
