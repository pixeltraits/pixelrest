/* eslint-disable no-undef,object-property-newline */
process.env.NODE_ENV = 'test';

const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

const EvenementModel = require('../../src/models/evenement.model');

const expect = chai.expect;

describe('Evenement Model should', () => {

  let evenementModel = null;

  beforeEach(() => {
    evenementModel = new EvenementModel();
  });

  it('format evenement calendrier bdd data', () => {
    const bddData = [{
      id: 33, id_type_evenement: 4, date: '2014-01-24',
      nom: 'CESAR', nom_court: 'cesar',
      ter_id: 36, ter_nom: 'Val-de-Marne'
    }, {
      id: 33, id_type_evenement: 4, date: '2014-01-24',
      nom: 'CESAR', nom_court: 'cesar',
      ter_id: 18, ter_nom: 'Alsace'
    }, {
      id: 38, id_type_evenement: 3, date: '2013-05-22',
      nom: 'CCFTHD', nom_court: 'ccfthd',
      ter_id: 11, ter_nom: 'Saint-Pierre-et-Miquelon'
    }];

    const formattedBddData = [{
      id: 33,
      date: '2014-01-24',
      typeEvenement: {
        nom: 'CESAR',
        nomCourt: 'cesar'
      },
      territoires: [
        { id: 36, nom: 'Val-de-Marne' },
        { id: 18, nom: 'Alsace' }
      ]
    }, {
      id: 38,
      date: '2013-05-22',
      typeEvenement: {
        nom: 'CCFTHD',
        nomCourt: 'ccfthd'
      },
      territoires: [
        { id: 11, nom: 'Saint-Pierre-et-Miquelon' }
      ]
    }];

    const result = evenementModel.formatEvenementsCalendrierBddData(bddData);

    expect(result).to.eql(formattedBddData);
  });
});
