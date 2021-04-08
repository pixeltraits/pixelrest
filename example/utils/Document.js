export default class Document {

  static getDocumentFileNewName(fileInformation, idDocument) {
    const fileOriginalName = fileInformation.originalname;

    const fileExtensionPosition = fileOriginalName.lastIndexOf('.');
    const fileNameWithoutExtension = fileOriginalName.slice(0, fileExtensionPosition);
    const fileExtension = fileOriginalName.slice(fileExtensionPosition);

    const fileNameWithIdDocument = `${fileNameWithoutExtension}${idDocument}${fileExtension}`;

    return fileNameWithIdDocument;
  }

}
