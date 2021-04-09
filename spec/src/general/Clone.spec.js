process.env.NODE_ENV = 'test';
import Clone from 'pixelrest/clone';


describe('Clone', () => {

  describe('simpleObject should', () => {

    it('clone the object in parameter', () => {
      const objectToClone = {
        a: 'test',
        b: 3
      };

      const clonedObject = Clone.simpleObject(objectToClone);

      expect(objectToClone).not.toBe(clonedObject);
      expect(objectToClone).toEqual(clonedObject);
    });

  });

});
