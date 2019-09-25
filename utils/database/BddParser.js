class BddParser {

  static parse(sqlRequest, sqlParameters) {
    const sqlRequestParsed = sqlRequest;
    const sqlParametersParsed = sqlParameters;

    return {
      sqlRequest: sqlRequestParsed,
      sqlParameters: sqlParametersParsed
    };
  }

}

module.exports = BddParser;
