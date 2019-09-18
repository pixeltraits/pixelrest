/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const path = require('path');
const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

const { ExcelValidator, ValidationErrors, WorksheetNames } = require('../../src/utils/ExcelValidator');
const { ExcelParser } = require('../../src/utils/ExcelParser');

const expect = chai.expect;

describe('Excel Validator should', () => {

  const missingPrevisionnelWorksheetFilename = 'template_previsionnel_missing.xlsx';
  const missingRealiseWorksheetFilename = 'template_realise_missing.xlsx';
  const wrongComposantesExistFilename = 'template_wrong_composantes_exist.xlsx';
  const dateMissingFilename = 'template_date_missing.xlsx';
  const notOnlyNumbersFilename = 'template_not_only_numbers.xlsx';
  const validExcelFilename = 'template_import_prevision.xlsx';

  const excelDir = path.join(__dirname, '../', 'resources', 'excel');

  let workbook;
  let testPath;

  describe('return errors when', () => {

    it('no workbook provided', () => {
      const errors = ExcelValidator.forDecaissement();
      expect(errors).to.eql([ ValidationErrors.NoWorkbook ]);
    });

    it('worksheet *Prévisionnel* is missing', async () => {
      testPath = path.join(excelDir, missingPrevisionnelWorksheetFilename);
      workbook = await ExcelParser.workbookFor(testPath);

      expect(ExcelValidator.forDecaissement(workbook)).to.eql([
        ValidationErrors.WorksheetMissing(WorksheetNames.Previsionnel)
      ]);
    });

    it('worksheet *Réalisé* is missing', async () => {
      testPath = path.join(excelDir, missingRealiseWorksheetFilename);
      workbook = await ExcelParser.workbookFor(testPath);

      expect(ExcelValidator.forDecaissement(workbook)).to.eql([
        ValidationErrors.WorksheetMissing(WorksheetNames.Realise)
      ]);
    });

    it('there is not only \'non\' or \'oui\' in composantes existing', async () => {
      testPath = path.join(excelDir, wrongComposantesExistFilename);
      workbook = await ExcelParser.workbookFor(testPath);

      expect(ExcelValidator.forDecaissement(workbook)).to.eql([
        ValidationErrors.ComposanteExistsOn(WorksheetNames.Previsionnel, 'Q', '3'),
        ValidationErrors.ComposanteExistsOn(WorksheetNames.Realise, 'C', '3')
      ]);
    });

    it('jalon has a number but no date', async () => {
      testPath = path.join(excelDir, dateMissingFilename);
      workbook = await ExcelParser.workbookFor(testPath);

      expect(ExcelValidator.forDecaissement(workbook)).to.eql([
        ValidationErrors.DateMissingOn(WorksheetNames.Previsionnel, 'B', '21'),
        ValidationErrors.DateMissingOn(WorksheetNames.Previsionnel, 'B', '22'),
        ValidationErrors.DateMissingOn(WorksheetNames.Previsionnel, 'B', '23'),
        ValidationErrors.DateMissingOn(WorksheetNames.Realise, 'B', '9'),
        ValidationErrors.DateMissingOn(WorksheetNames.Realise, 'B', '10')
      ]);
    });

    it('there\'s not only numbers in fetched datas', async () => {
      testPath = path.join(excelDir, notOnlyNumbersFilename);
      workbook = await ExcelParser.workbookFor(testPath);

      expect(ExcelValidator.forDecaissement(workbook)).to.eql([
        ValidationErrors.ShouldBeANumber(WorksheetNames.Previsionnel, 'C', '4'),
        ValidationErrors.ShouldBeANumber(WorksheetNames.Previsionnel, 'C', '5'),
        ValidationErrors.ShouldBeANumber(WorksheetNames.Previsionnel, 'C', '6'),
        ValidationErrors.ShouldBeANumber(WorksheetNames.Previsionnel, 'C', '7'),
        ValidationErrors.ShouldBeANumber(WorksheetNames.Previsionnel, 'C', '8'),
        ValidationErrors.ShouldBeANumber(WorksheetNames.Previsionnel, 'C', '9'),
        ValidationErrors.ShouldBeANumber(WorksheetNames.Realise, 'C', '4'),
        ValidationErrors.ShouldBeANumber(WorksheetNames.Realise, 'C', '5'),
        ValidationErrors.ShouldBeANumber(WorksheetNames.Realise, 'C', '6'),
        ValidationErrors.ShouldBeANumber(WorksheetNames.Realise, 'C', '7'),
        ValidationErrors.ShouldBeANumber(WorksheetNames.Realise, 'C', '8'),
        ValidationErrors.ShouldBeANumber(WorksheetNames.Realise, 'C', '9'),
      ]);
    });
  });

  it('be ok when validation succeeds', async () => {
    testPath = path.join(excelDir, validExcelFilename);
    workbook = await ExcelParser.workbookFor(testPath);

    const errors = ExcelValidator.forDecaissement(workbook);

    expect(errors.length).to.equal(0);
    expect(errors).to.eql([]);
  });
});
