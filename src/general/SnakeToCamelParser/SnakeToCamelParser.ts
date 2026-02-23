function toCamelCase(str: string): string {
  return str.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());
}

export default class SnakeToCamelParser {
  static parse(snakecaseData: unknown): unknown {
    if (snakecaseData === null) {
      return null;
    }

    if (Array.isArray(snakecaseData)) {
      return SnakeToCamelParser.parseArray(snakecaseData);
    }

    if (snakecaseData instanceof Date) {
      return snakecaseData;
    }

    if (typeof snakecaseData === 'object') {
      return SnakeToCamelParser.parseObject(snakecaseData as Record<string, unknown>);
    }

    return snakecaseData;
  }

  private static parseArray(snakecaseArray: unknown[]): unknown[] {
    return snakecaseArray.map(SnakeToCamelParser.parse);
  }

  private static parseObject(snakecaseObject: Record<string, unknown>): Record<string, unknown> {
    const camelcaseObject: Record<string, unknown> = {};

    Object.keys(snakecaseObject).forEach(snakecaseObjectKey => {
      camelcaseObject[toCamelCase(snakecaseObjectKey)] = SnakeToCamelParser.parse(snakecaseObject[snakecaseObjectKey]);
    });

    return camelcaseObject;
  }
}
