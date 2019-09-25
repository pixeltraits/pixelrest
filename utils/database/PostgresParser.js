const BddParser = require('./BddParser');


class PostgresParser {

  /**
   * Improves the postgres parameters system
   * @method parse
   * @param {string} sqlRequest - SQL request
   * @return {}
   */
  static parse(sqlRequest, sqlParameters = null) {
    let formatedSqlRequest = sqlRequest.replace(/\s+/g, ' ');
    const startReferenceString = '~';
    const endReferenceRegex = /\s|,|;|\)/g;
    const identifierLength = formatedSqlRequest.split(startReferenceString).length - 1;
    let nextIndex = 0;

    formatedSqlRequest = formatedSqlRequest.replace(/(\r\n|\n|\r)/gm, '');

    if (identifierLength <= 0) {
      return formatedSqlRequest;
    }

    for (let x = 0; x < identifierLength; x++) {
      const referenceIndex = formatedSqlRequest.indexOf(startReferenceString, nextIndex);

      if (referenceIndex !== -1) {
        const endReferenceIndex = referenceIndex + formatedSqlRequest.substring(referenceIndex).search(endReferenceRegex);
        const parameterReference = formatedSqlRequest.substring(referenceIndex + 1, endReferenceIndex);
        const replaceRegex = new RegExp(`\\${startReferenceString}${parameterReference}`, 'g');
        nextIndex = endReferenceIndex;
        formatedSqlRequest = formatedSqlRequest.replace(replaceRegex, '${' + parameterReference + '}');
      }
    }

    return {
      sqlRequest: formatedSqlRequest,
      sqlParameters: sqlParameters
    }
  }

}

module.exports = PostgresParser;
