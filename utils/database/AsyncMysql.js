export default class AsyncMysql {

  static async query(mysqlPool, ) {
    return new Promise((resolve, reject) => {
      mysqlPool.query(
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
