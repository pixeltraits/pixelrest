export default class Collection {

  static sumAllElements(elementList) {
    let total = 0;

    elementList.forEach(element => {
      total += element;
    });

    return total;
  }

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

  static filterByField(collection, field) {
    const filteredCollection = [];

    collection.forEach(row => {
      filteredCollection.push(row[field]);
    });

    return filteredCollection;
  }

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
