/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const path = require('path');
const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

const { ExcelImport } = require('../../src/utils/ExcelImport');
const { ExcelParser } = require('../../src/utils/ExcelParser');

const expect = chai.expect;

describe('Excel Importer should', () => {
  /**
   * If shouldTestImport is set to false, import test will be skipped.
   * Please consider that switching this to true will run the full import,
   *  thus requiring the developer to manually delete entries in DB after
   *  the test. This test is not FIRST.
   * @type {boolean}
   */
  const shouldTestImport = false;
  const idVolet = 2; // Serial.Max = 2.147.483.647

  const validExcelFilename = 'template_import_prev_fetched.xlsx';
  const excelDir = path.join(__dirname, '../', 'resources', 'excel');

  let workbook;
  let testPath;

  (shouldTestImport ? it : it.skip)('return inserts for a full import', async () => {
    testPath = path.join(excelDir, validExcelFilename);
    workbook = await ExcelParser.workbookFor(testPath);

    const inserts = await ExcelImport.from(workbook, idVolet);

    expect(inserts.composantes).to.equal(2);
    expect(inserts.jalons).to.equal(20);
  });
});
