/* eslint-disable object-property-newline */
const { TypesComposantes } = require('../../../src/models/business/types-composantes');

const versement1 = {
  numero: 1,
  realise: false,
  date_previsionnelle: '2016-11-14T23:00:00.000Z',
  date_realisee: '2016-11-27T23:00:00.000Z'
};

const versement2 = {
  numero: 1,
  realise: true,
  date_previsionnelle: '2016-11-14T23:00:00.000Z',
  date_realisee: '2016-11-27T23:00:00.000Z'
};

const versement3 = {
  numero: 2,
  realise: false,
  date_previsionnelle: '2016-11-14T23:00:00.000Z',
  date_realisee: '2016-11-27T23:00:00.000Z'
};

const versement4 = {
  numero: 2,
  realise: true,
  date_previsionnelle: '2016-11-14T23:00:00.000Z',
  date_realisee: '2016-11-27T23:00:00.000Z'
};

const versement5 = {
  numero: 3,
  realise: false,
  date_previsionnelle: '2016-11-14T23:00:00.000Z',
  date_realisee: null
};

const versement6 = {
  numero: 3,
  realise: true,
  date_previsionnelle: '2016-11-14T23:00:00.000Z',
  date_realisee: null
};

const versement7 = {
  numero: 4,
  realise: false,
  date_previsionnelle: '2016-11-14T23:00:00.000Z',
  date_realisee: null
};

const versement8 = {
  numero: 4,
  realise: true,
  date_previsionnelle: '2016-11-14T23:00:00.000Z',
  date_realisee: null
};

const versement9 = {
  numero: 5,
  realise: false,
  date_previsionnelle: '2016-11-14T23:00:00.000Z',
  date_realisee: null
};

const versement10 = {
  numero: 5,
  realise: true,
  date_previsionnelle: '2016-11-14T23:00:00.000Z',
  date_realisee: null
};

const forComposante1 = {
  subvention: 1,
  montant_uo: 2,
  id_type_composante: TypesComposantes.CollecteMed
};

const forComposante2 = {
  subvention: 3,
  montant_uo: 4,
  id_type_composante: TypesComposantes.RaccoFtth
};

const forComposante3 = {
  subvention: 5,
  montant_uo: 6,
  id_type_composante: TypesComposantes.DesserteFtth
};

const Versements = {
  versement1, versement2, versement3, versement4,
  versement5, versement6, versement7, versement8,
  versement9, versement10,
  forComposante1, forComposante2, forComposante3
};

module.exports = { Versements };
