/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const path = require('path');
const Excel = require('exceljs');

chai.should();
chai.use(require('chai-things'));

const { ExcelParser } = require('../../src/utils/ExcelParser');

const expect = chai.expect;

describe('Excel Parser should', () => {

  const resourcesDir = path.join(__dirname, '../', 'resources');

  it('throw when no filename', done => {
    ExcelParser.workbookFor()
      .catch(err => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('throw when filename is empty', done => {
    ExcelParser.workbookFor('')
      .catch(err => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('throw when filename doesn\'t exist', done => {
    ExcelParser.workbookFor('doesntExist.xlsx')
      .catch(err => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('throw when filename extension is not .xlsx', done => {
    const existingTxtFile = path.join(resourcesDir, 'exists.txt');

    ExcelParser.workbookFor(existingTxtFile)
      .catch(err => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('resolve an excel workbook when given a .xlsx', done => {
    const excelDir = path.join(resourcesDir, 'excel');
    const existingXlsxFile = path.join(excelDir, 'template_basic.xlsx');

    ExcelParser.workbookFor(existingXlsxFile)
      .then(workbook => {
        expect(workbook).to.exist;
        expect(workbook).to.be.an.instanceof(Excel.Workbook);
        done();
      });
  });
});
