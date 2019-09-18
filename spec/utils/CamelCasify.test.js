/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const chai = require('chai');

chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-spies'));

const CamelCasify = require('../../src/utils/CamelCasify');

const expect = chai.expect;

describe('CamelCasify', () => {

  describe('do should', () => {

    it('call doArray if argument data is an array', () => {
      const argumentData = [];
      const mySpy = chai.spy.on(CamelCasify, 'doArray');

      CamelCasify.do(argumentData);

      expect(mySpy).to.have.been.called();
    });

    it('call doObject if argument data is an object', () => {
      const argumentData = {};
      const mySpy = chai.spy.on(CamelCasify, 'doObject');

      CamelCasify.do(argumentData);

      expect(mySpy).to.have.been.called();
    });
  });

  describe('camelCasifyArray should', () => {

    it('camelcasify an array', () => {
      const noCamelArray = [{
        banjo_kazooie: { test_gruntilda: null },
        champion_du_monde: 0
      }, {
        jaime_les_licornes: ['portal', 'stalker', 'metro'],
        born_to_be_alive: { test_aperture: false },
        jaime_les_gateaux: true
      }];

      const expected = [{
        banjoKazooie: { testGruntilda: null },
        championDuMonde: 0
      }, {
        jaimeLesLicornes: ['portal', 'stalker', 'metro'],
        bornToBeAlive: { testAperture: false },
        jaimeLesGateaux: true
      }];

      expect(CamelCasify.doArray(noCamelArray)).to.eql(expected);
    });
  });

  describe('camelCasifyObject should', () => {

    it('camelcasify an object', () => {
      const noCamelObject = {
        nintendo_64: {
          banjo_kazooie: { test_gruntilda: false },
          champion_du_monde: 0
        },
        geforce_8700: {
          jaime_les_licornes: ['portal', 'stalker', 'metro'],
          born_to_be_alive: { test_aperture: false },
          jaime_les_gateaux: true
        }
      };

      const expected = {
        nintendo64: {
          banjoKazooie: { testGruntilda: false },
          championDuMonde: 0
        },
        geforce8700: {
          jaimeLesLicornes: ['portal', 'stalker', 'metro'],
          bornToBeAlive: { testAperture: false },
          jaimeLesGateaux: true
        }
      };

      expect(CamelCasify.doObject(noCamelObject)).to.eql(expected);
    });
  });
});
