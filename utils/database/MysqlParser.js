import BddParser from './BddParser.js';


export default class MysqlParser extends BddParser {

  static parse(sqlRequest, sqlParameters) {
    let nextIndex = 0;
    let formatedSqlRequest = sqlRequest.replace(/\s+/g, ' ');
    let parametersArray = [];
    const startReferenceString = '~';
    const endReferenceRegex = /\s|,|;|\)/g;
    let identifierLength = formatedSqlRequest.split(startReferenceString).length - 1;

    formatedSqlRequest = formatedSqlRequest.replace(/(\r\n|\n|\r)/gm, '');

    if (identifierLength > 0) {
      for (let x = 0; x < identifierLength; x++) {
        let referenceIndex = formatedSqlRequest.indexOf(startReferenceString, nextIndex);

        if (referenceIndex != -1 && typeof referenceIndex != `undefined`) {
          let endReferenceIndex = referenceIndex + formatedSqlRequest.substring(referenceIndex).search(endReferenceRegex);
          let parameterReference = formatedSqlRequest.substring(referenceIndex + 1, endReferenceIndex);
          let replaceRegex = new RegExp(`\\${startReferenceString}${parameterReference}`, `g`);
          nextIndex = endReferenceIndex;
          formatedSqlRequest = formatedSqlRequest.replace(replaceRegex, '?');
          parametersArray.push(sqlParameters[parameterReference]);
        }
      }
    }

    return {
      sqlRequest: formatedSqlRequest,
      sqlParameters: parametersArray
    }
  }

}
