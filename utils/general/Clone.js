export default class Clone {

  static simpleObject(objectReference) {
    return JSON.parse(JSON.stringify(objectReference));
  }

}
