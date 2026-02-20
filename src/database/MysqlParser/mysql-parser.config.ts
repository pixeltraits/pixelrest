export const MYSQL_PARSER_IDENTIFIER = {
  FIRST_CHAR: '~',
  END_CHAR: /\s|,|;|\)/g,
  PARSER_ERROR: 'A parser should define a parse method'
} as const;
