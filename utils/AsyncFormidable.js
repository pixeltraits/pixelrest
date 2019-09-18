const formidable = require('formidable');


/**
 * AsyncFormidable - Permet d'utiliser async/await avec la librairie formidable
 * @class AsyncFormidable
 */
class AsyncFormidable {

  static async for(req, uploadDir) {
    return new Promise(async (resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.on('error', reject);

      form.multiples = false;
      form.keepExtensions = true;
      form.uploadDir = uploadDir;

      const parseArguments = await AsyncFormidable.parse(req, form);
      resolve(parseArguments);
    });
  }

  static async parse(req, form) {
    return new Promise((resolve, reject) => {
      form.parse(
        req,
        (error, fields, files) => {
          if (error) {
            reject(error);
          }
          resolve({
            fields,
            files
          });
        }
      );
    });
  }
}

module.exports = AsyncFormidable;
