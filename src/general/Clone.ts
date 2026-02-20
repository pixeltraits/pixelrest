export default class Clone {
  static simpleObject<T>(objectReference: T): T {
    return structuredClone(objectReference);
  }
}
