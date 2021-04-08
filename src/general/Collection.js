/**
 * @class Collection
 */
export default class Collection {
  /**
   * sumAllElements
   * @public
   * @method sumAllElements
   * @param {array<number>} elementList - object to clone
   * @return {number} cloned object
   */
  static sumAllElements(elementList) {
    let total = 0;

    elementList.forEach(element => {
      total += element;
    });

    return total;
  }
  /**
   * removeDuplicatesByField
   * @public
   * @method removeDuplicatesByField
   * @param {array<object>} collection - object list
   * @param {string} field - field name
   * @return {array<object>} filtered object list
   */
  static removeDuplicatesByField(collection, field) {
    const newCollection = [];

    collection.forEach(collectionObject => {
      const isExist = newCollection.find(newCollectionObject => newCollectionObject[field] === collectionObject[field]);
      if (!isExist) {
        newCollection.push(collectionObject);
      }
    });

    return newCollection;
  }
  /**
   * filterByField
   * getAll array of fields
   * @public
   * @method filterByField
   * @param {array<object>} collection - object list
   * @param {string} field - field name
   * @return {array<any>} array of every selected fields
   */
  static filterByField(collection, field) {
    const filteredCollection = [];

    collection.forEach(row => {
      filteredCollection.push(row[field]);
    });

    return filteredCollection;
  }
  /**
   * promiseAllByCollection
   * @public
   * @method promiseAllByCollection
   * @param {array<any>} collection - list of promise argument
   * @param {promise} promiseReference - promise reference
   * @return {array<any>} array promises result
   */
  static async promiseAllByCollection(collection, promiseReference) {
    const collectionLength = collection.length;
    const promises = [];

    for (let x = 0; x < collectionLength; x++) {
      promises.push(
        promiseReference(collection[x])
      );
    }

    return Promise.all(promises);
  }
  /**
   * promiseAllByCollectionWithOptions
   * @public
   * @method promiseAllByCollectionWithOptions
   * @param {array<any>} collection - list of promise argument
   * @param {any} options - common argument of all promise
   * @param {promise} promiseReference - promise reference
   * @return {array<any>} array promises result
   */
  static async promiseAllByCollectionWithOptions(collection, options, promiseReference) {
    const collectionLength = collection.length;
    const promises = [];

    for (let x = 0; x < collectionLength; x++) {
      promises.push(
        promiseReference(collection[x], options)
      );
    }

    return Promise.all(promises);
  }
}
