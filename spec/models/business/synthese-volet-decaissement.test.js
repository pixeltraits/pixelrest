/* eslint-disable no-undef */
const chai = require('chai');

chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-spies'));

const expect = chai.expect;

const { Versements } = require('../data/versements');

const { SyntheseVoletDecaissement } = require('../../../src/models/business/synthese-volet-decaissement');

describe('SyntheseVoletDecaissement should', () => {

  it('find jalons en cours at instantiation', () => {
    const sut = new SyntheseVoletDecaissement([
      Versements.versement1,
      Versements.versement5,
      Versements.versement6,
      Versements.versement9
    ]);

    expect(sut.versementsJalonEnCours).to.eql([
      Versements.versement5,
      Versements.versement6
    ]);
  });

  it('map versements to synthese volet', () => {
    const sut = new SyntheseVoletDecaissement([]);
    const versements = [
      Versements.forComposante1,
      Versements.forComposante2,
      Versements.forComposante3
    ];

    const expected = {
      uoCollecte: 2,
      uoDesserte: 6,
      uoRaccordement: 4,
      subventionCollecte: 1,
      subventionDesserte: 5,
      subventionRaccordement: 3,
      subventionTotal: 9
    };

    expect(sut.toSyntheseVolet(versements)).to.eql(expected);
  });

  describe('retrieve versements', () => {
    let sut;

    const versements = [
      Versements.versement1,
      Versements.versement2,
      Versements.versement3,
      Versements.versement4,
      Versements.versement5,
      Versements.versement6,
      Versements.versement7,
      Versements.versement8,
      Versements.versement9,
      Versements.versement10,
    ];

    beforeEach(() => {
      sut = new SyntheseVoletDecaissement(versements);
      chai.spy.on(sut, 'toSyntheseVolet', any => any);
    });

    it('a date', () => {
      expect(sut.getVersementsADate()).to.eql([
        Versements.versement2,
        Versements.versement4
      ]);
    });

    it('en cours', () => {
      expect(sut.getVersementsEnCours()).to.eql([
        Versements.versement5,
        Versements.versement6
      ]);
    });

    it('a venir', () => {
      expect(sut.getVersementsAVenir()).to.eql([
        Versements.versement7,
        Versements.versement9
      ]);
    });
  });
});
