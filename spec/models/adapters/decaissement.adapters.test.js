/* eslint-disable no-undef,object-property-newline */
process.env.NODE_ENV = 'test';

const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

const adapters = require('../../../src/models/adapters/decaissement.adapters');

const expect = chai.expect;

describe('Decaissement adapters', () => {

  describe('detailsJalons should', () => {

    it('correctly map', () => {
      const details = [{
        id: 1, date_previsionnelle: '2016-11-14T23:00:00.000Z',
        numero: 1, date_realisee: '2016-11-27T23:00:00.000Z'
      }, {
        id: 2, date_previsionnelle: '2017-05-14T22:00:00.000Z',
        numero: 2, date_realisee: null
      }];

      const montants = [{
        id: 1, id_jalon_versement: 1, realise: false,
        type: 'Collecte NRA/NRO', subvention: 3309789,
        montant_uo: '32615', type_uo: 'km'
      }, {
        id: 2, id_jalon_versement: 1, realise: true,
        type: 'Collecte NRA/NRO', subvention: 3309789,
        montant_uo: '32615', type_uo: 'km'
      }, {
        id: 3, id_jalon_versement: 2, realise: false,
        type: 'Collecte NRA/NRO', subvention: 3759452,
        montant_uo: '79669', type_uo: 'km'
      }, {
        id: 4, id_jalon_versement: 2, realise: true,
        type: 'Collecte NRA/NRO', subvention: 3759452,
        montant_uo: '79669', type_uo: 'km'
      }, {
        id: 5, id_jalon_versement: 2, realise: true,
        type: 'Collecte FttN', subvention: 3759452,
        montant_uo: '79669', type_uo: 'op PRM'
      }, {
        id: 6, id_jalon_versement: 2, realise: true,
        type: 'Collecte FttN', subvention: 3759452,
        montant_uo: '79669', type_uo: 'lignes'
      }];

      const origin = [details, montants];

      const expected = {
        detailsJalons: [{
          id: 1, date_previsionnelle: '2016-11-14T23:00:00.000Z',
          numero: 1, date_realisee: '2016-11-27T23:00:00.000Z'
        }, {
          id: 2, date_previsionnelle: '2017-05-14T22:00:00.000Z',
          numero: 2, date_realisee: null
        }],
        composantesPrevsByType: [{
          type: 'Collecte NRA/NRO',
          composantes: [{
            id: 1, id_jalon_versement: 1, realise: false,
            type: 'Collecte NRA/NRO', subvention: 3309789,
            montant_uo: '32615', type_uo: 'km',
          }, {
            id: 3, id_jalon_versement: 2, realise: false,
            type: 'Collecte NRA/NRO', subvention: 3759452,
            montant_uo: '79669', type_uo: 'km',
          }]
        }, {
          type: 'Collecte FttN',
          composantes: []
        }],
        composantesRealisesByType: [{
          type: 'Collecte NRA/NRO',
          composantes: [{
            id: 2, id_jalon_versement: 1, realise: true,
            type: 'Collecte NRA/NRO', subvention: 3309789,
            montant_uo: '32615', type_uo: 'km',
          }, {
            id: 4, id_jalon_versement: 2, realise: true,
            type: 'Collecte NRA/NRO', subvention: 3759452,
            montant_uo: '79669', type_uo: 'km',
          }]
        }, {
          type: 'Collecte FttN',
          composantes: [{
            id: 5, id_jalon_versement: 2, realise: true,
            type: 'Collecte FttN', subvention: 3759452,
            montant_uo: '79669', type_uo: 'op PRM',
          }]
        }]
      };

      expect(adapters.voletJalonsData(origin)).to.eql(expected);
    });
  });
});
