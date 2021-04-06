process.env.NODE_ENV = 'test';
import Collection from 'node-rest/collection';


describe('Collection', () => {

  describe('sumAllElements should', () => {

    it('sum all elements of the list', () => {
      const elements = [
        1,
        3,
        5
      ];
      const expectedSum = 9;

      const elementSum = Collection.sumAllElements(elements);

      expect(expectedSum).toEqual(elementSum);
    });

  });

  describe('removeDuplicatesByField should', () => {

    it('remove duplicates object by field of collection object', () => {
      const objectList = [
        {
          id: 5,
          message: 'test'
        },
        {
          id: 5,
          message: 'test'
        },
        {
          id: 3,
          message: 'test'
        },
        {
          id: 4,
          message: 'test'
        }
      ];
      const expectedObjectList = [
        {
          id: 5,
          message: 'test'
        },
        {
          id: 3,
          message: 'test'
        },
        {
          id: 4,
          message: 'test'
        }
      ];

      const filteredObjectList = Collection.removeDuplicatesByField(objectList, 'id');

      expect(filteredObjectList).toEqual(expectedObjectList);
    });

  });

  describe('filterByField should', () => {

    it('generate list of content field of all objects for one field', () => {
      const objectList = [
        {
          id: 5,
          message: 'test'
        },
        {
          id: 6,
          message: 'test'
        },
        {
          id: 3,
          message: 'test'
        },
        {
          id: 4,
          message: 'test'
        }
      ];
      const expectedList = [
        5,
        6,
        3,
        4
      ];

      const idList = Collection.filterByField(objectList, 'id');

      expect(idList).toEqual(expectedList);
    });

  });

  describe('promiseAllCollectionByCollection should', () => {

    it('return promise.all() with each element of the collection insert in argument of each promise', async () => {
      const collectionArguments = [
        1,
        2,
        3
      ];
      const promiseReference = async (id) => {
        return id;
      };
      const expectedPromiseTable = await Promise.all([
        promiseReference(1),
        promiseReference(2),
        promiseReference(3)
      ]);
      const expectedData = [
        1,
        2,
        3
      ];

      const idList = await Collection.promiseAllByCollection(collectionArguments, promiseReference);

      expect(expectedPromiseTable).toEqual(idList);
      expect(expectedData).toEqual(idList);
    });

  });

  describe('promiseAllCollectionByCollectionWithOptions should', () => {

    it('return promise.all() with each element of the collection insert in argument of each promise with an fixed argument for every promise', async () => {
      const collectionArguments = [
        1,
        2,
        3
      ];
      const promiseReference = async (intArg, options) => {
        return intArg * options.multiplier;
      };
      const options = {
        multiplier: 2
      };
      const expectedPromiseTable = await Promise.all([
        promiseReference(1, options),
        promiseReference(2, options),
        promiseReference(3, options)
      ]);
      const expectedData = [
        2,
        4,
        6
      ];

      const intList = await Collection.promiseAllByCollectionWithOptions(collectionArguments, options, promiseReference);

      expect(expectedPromiseTable).toEqual(intList);
      expect(expectedData).toEqual(intList);
    });

  });

});
