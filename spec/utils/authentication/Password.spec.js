process.env.NODE_ENV = 'test';
import bcrypt from 'bcrypt';

import Password from 'node-rest/password';


describe('Password', () => {

  describe(`hash should`, () => {

    const password = 'test!!!526a@Afer';

    it(`return valid bcryot hashed password`, async () => {
      const hashedPassword = await Password.hash(password);

      const isValidHash = await bcrypt.compare(password, hashedPassword);

      expect(isValidHash).toBeTruthy();
    });

  });

  describe(`validate should`, () => {

    const expectedPassword = 'test!!!526a@Afer';

    it(`return true if the password correspond to hashedPassword`, async () => {
      const hashedPassword = await bcrypt.hash(expectedPassword, 10);

      const isValidPassword = await Password.validate(expectedPassword, hashedPassword);

      expect(isValidPassword).toBeTruthy();
    });

    it(`return false if the password does not match hashedPassword`, async () => {
      const wrongPassword = 'test';
      const hashedPassword = await bcrypt.hash(expectedPassword, 10);

      const isValidPassword = await Password.validate(wrongPassword, hashedPassword);

      expect(isValidPassword).toBeFalsy();
    });

  });

});
