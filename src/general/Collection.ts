export default class Collection {
  static sumAllElements(elementList: number[]): number {
    let total = 0;

    elementList.forEach(element => {
      total += element;
    });

    return total;
  }

  static removeDuplicatesByField<T extends Record<string, unknown>>(collection: T[], field: string): T[] {
    const newCollection: T[] = [];

    collection.forEach(collectionObject => {
      const isExist = newCollection.find(newCollectionObject => newCollectionObject[field] === collectionObject[field]);
      if (!isExist) {
        newCollection.push(collectionObject);
      }
    });

    return newCollection;
  }

  static filterByField<T extends Record<string, unknown>>(collection: T[], field: string): unknown[] {
    const filteredCollection: unknown[] = [];

    collection.forEach(row => {
      filteredCollection.push(row[field]);
    });

    return filteredCollection;
  }

  static async promiseAllByCollection<T, R>(
    collection: T[],
    promiseReference: (item: T) => Promise<R>
  ): Promise<R[]> {
    const promises: Promise<R>[] = [];

    for (let x = 0; x < collection.length; x++) {
      promises.push(promiseReference(collection[x]));
    }

    return Promise.all(promises);
  }

  static async promiseAllByCollectionWithOptions<T, O, R>(
    collection: T[],
    options: O,
    promiseReference: (item: T, options: O) => Promise<R>
  ): Promise<R[]> {
    const promises: Promise<R>[] = [];

    for (let x = 0; x < collection.length; x++) {
      promises.push(promiseReference(collection[x], options));
    }

    return Promise.all(promises);
  }
}
