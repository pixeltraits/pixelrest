/* eslint-disable no-undef,no-unused-vars */
process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');
const chai = require('chai');

chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-spies'));

const AsyncFormidable = require('../../src/utils/AsyncFormidable');
const { FileSystemHandler } = require('../../src/utils/FileSystemHandler');

const expect = chai.expect;

describe('FileSystemHandler should', () => {

  const testfileName = 'dummy_test.txt';
  const resourcesDir = path.join(__dirname, '../', 'resources');
  const tmpDir = path.join(resourcesDir, 'tmp');

  const origin = path.join(resourcesDir, testfileName);
  const tmpOrigin = path.join(tmpDir, testfileName);

  const copyFileName = 'whatever_name.txt';
  const destination = path.join(tmpDir, copyFileName);

  const copyTestFileToTmpDir = () => {
    fs.copyFileSync(origin, tmpOrigin);
  };

  const sandbox = chai.spy.sandbox();

  beforeEach(() => {
    sandbox.on(
      AsyncFormidable, 'for',
      async (req, dir) => (Promise.resolve(true))
    );
    sandbox.on(fs, 'rename');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('return the upload directory', () => {
    const uploadDirectory = FileSystemHandler.getUploadDirectory();

    expect(uploadDirectory).to.be.a('string');
  });

  it('parse file infos with AsyncFormidable', async () => {
    sandbox.on(FileSystemHandler, 'getUploadDirectory');

    await FileSystemHandler.parseFileInfosFrom({});

    expect(FileSystemHandler.getUploadDirectory).to.have.been.called();
    expect(AsyncFormidable.for).to.have.been.called();
  });

  it('be able to rename files', done => {
    sandbox.on(
      FileSystemHandler, 'getUploadDirectory',
      () => tmpDir
    );

    copyTestFileToTmpDir();

    FileSystemHandler.moveFile(tmpOrigin, copyFileName)
      .then(() => {
        expect(fs.existsSync(destination)).to.equal(true);
      })
      .finally(() => {
        fs.unlinkSync(destination);
        done();
      });
  });

  it('reject an error when couldn\'t move file', done => {
    FileSystemHandler.moveFile('what', 'ever')
      .catch(err => {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('be able to unlink files', done => {
    sandbox.on(
      FileSystemHandler, 'getUploadDirectory',
      () => tmpDir
    );

    copyTestFileToTmpDir();

    FileSystemHandler.unlink(testfileName)
      .then(() => {
        expect(fs.existsSync(destination)).to.equal(false);
        done();
      });
  });

  it('reject an error when couldn\'t unlink file', done => {
    FileSystemHandler.unlink(testfileName)
      .catch(err => {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });
});
