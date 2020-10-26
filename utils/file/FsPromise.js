import fs from 'fs';


export default class FsPromise {

  static async moveFile(filePath, newfilePath) {
    console.log(filePath, newfilePath, "M")
    return Promise.all([
      FsPromise.copyFile(filePath, newfilePath),
      FsPromise.unlink(filePath)
    ]);
  }

  static async copyFile(filePath, newfilePath) {
    console.log(filePath, newfilePath, "C")
    return new Promise((resolve, reject) => {
      fs.copyFile(filePath, newfilePath, error => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  static async unlink(filePath) {
    console.log(filePath)
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, error => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

}
