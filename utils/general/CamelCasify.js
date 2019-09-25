const camelCase = require('camelcase');


class CamelCasify {

  static forExpress(req, res, next) {
    const performSend = res.send;
    res.send = body => {
      performSend.call(res, CamelCasify.do(body));
    };
    next();
  }

  static do(data) {
    if (data === null) {
      return null;
    }
    if (Array.isArray(data)) {
      return CamelCasify.doArray(data);
    }
    if (data instanceof Date) {
      return data;
    }
    if (typeof data === 'object') {
      return CamelCasify.doObject(data);
    }
    return data;
  }

  static doArray(arrayObj) {
    return arrayObj.map(CamelCasify.do);
  }

  static doObject(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[camelCase(key)] = CamelCasify.do(obj[key]);
      return acc;
    }, {});
  }

}

module.exports = CamelCasify;
