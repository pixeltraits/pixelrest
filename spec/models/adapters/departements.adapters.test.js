/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

const adapters = require('../../../src/models/adapters/departements.adapters');

const expect = chai.expect;

describe('Departements adapters', () => {

  describe('departementsPreferes should', () => {

    it('correctly map', () => {
      const origin = [{ code: '01' }, { code: '02' }];
      const expected = ['01', '02'];

      expect(adapters.departementsPreferes(origin)).to.eql(expected);
    });
  });
});
