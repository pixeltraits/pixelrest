import { FileInformation } from './document.config.js';

export default class Document {

  static getDocumentFileNewName(fileInformation: FileInformation, idDocument: number | null): string {
    const fileOriginalName = fileInformation.originalname;

    const fileExtensionPosition = fileOriginalName.lastIndexOf('.');
    const fileNameWithoutExtension = fileOriginalName.slice(0, fileExtensionPosition);
    const fileExtension = fileOriginalName.slice(fileExtensionPosition);

    return `${fileNameWithoutExtension}${idDocument}${fileExtension}`;
  }

}
