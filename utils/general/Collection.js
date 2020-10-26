export default class Collection {

  static sumAllElements(elementList) {
    let total = 0;

    elementList.forEach(element => {
      total += element;
    });

    return total;
  }

  static uniqBy(collection, field) {
    const result = [];
    collection.forEach(row => {
      const found = result.find(r => r[field] === row[field]);
      if (!found) {
        result.push({ ...row });
      }
    });
    return result;
  }

  static uniqByField(collection, field) {
    const result = [];
    collection.forEach(row => {
      const found = result.find(r => r === row[field]);
      if (!found) {
        result.push(row[field]);
      }
    });
    return result;
  }

  static filterByField(collection, field) {
    const filteredCollection = [];
    collection.forEach(row => {
      filteredCollection.push(row[field]);
    });

    return filteredCollection;
  }

  static async promiseAllCollectionByCollection(collection, promiseReference) {
    const collectionLength = collection.length;
    const promises = [];

    for (let x = 0; x < collectionLength; x++) {
      promises.push(
        promiseReference(collection[x])
      );
    }

    return Promise.all(promises);
  }

  static async promiseAllCollectionByCollectionWithOptions(collection, options, promiseReference) {
    const collectionLength = collection.length;
    const promises = [];

    for (let x = 0; x < collectionLength; x++) {
      promises.push(
        promiseReference(collection[x], options)
      );
    }

    return Promise.all(promises);
  }

  static transformTableToObject(objectIds, table) {
    const objectIdsLength = objectIds.length;
    const newObject = {};

    for (let x = 0; x < objectIdsLength; x++) {
      newObject[objectIds[x]] = table[x];
    }

    return newObject;
  }

  static isInArray(table, value) {
    if (table.find(row => row === value)) {
      return true;
    }

    return false;
  }

  static generateIntTable(starter, tableLength) {
    const intTable = [];

    for (let x = starter; x < tableLength; x++) {
      intTable.push(x);
    }

    return intTable;
  }

}
