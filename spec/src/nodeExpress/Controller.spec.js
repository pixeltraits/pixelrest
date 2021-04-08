process.env.NODE_ENV = 'test';
import Controller from 'node-rest/controller';


describe('Controller', () => {

  describe(`isNullOrNumber should`, () => {

    it(`return true if the argument is null or is a number`, () => {
      expect(Controller.isNullOrNumber(null)).toBeTruthy();
      expect(Controller.isNullOrNumber(5)).toBeTruthy();
    });

    it(`return false if the argument is not null && is not a number`, () => {
      let value;

      expect(Controller.isNullOrNumber(value)).toBeFalsy();
      expect(Controller.isNullOrNumber('test')).toBeFalsy();
      expect(Controller.isNullOrNumber(true)).toBeFalsy();
    });

  });

});
