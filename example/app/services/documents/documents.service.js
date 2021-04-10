import fsPromises from 'fs/promises';

import HttpResolver from 'pixelrest/httpResolver';
import Service from 'pixelrest/service';

import Document from "../../utils/Document.js";
import { ROLES } from '../../config/roles.js';
import {
  addSchema,
} from './documents.schema.js';
import { SERVER } from "../../config/server.js";


export default class DocumentsService extends Service {

  initRoute() {
    this.routesConfig = [
      {
        route: '/documents',
        execute: 'add',
        method: this.HTTP_METHODS.POST,
        multerConfig: {
          uploadDirectory: 'temp',
          documentFieldName: 'fileDocument',
          multerMethodName: 'single',
          limits: {
            fieldSize: 2000000,
            fileSize: 100000000
          },
          allowedMimeTypes: SERVER.ALLOWED_MIMETYPES_DOCUMENTS
        },
        schema: addSchema,
        roles: [ROLES.ADMIN]
      }
    ];
  }

  async add(req, res) {
    try {
      const documentInformations = {
        id: null,
        name: req.body.name,
        description: req.body.description,
        filename: ''
      };
      documentInformations.id = await this.repositories.documents.add(documentInformations);
      documentInformations.filename = Document.getDocumentFileNewName(req.file, documentInformations.id);
      await this.repositories.documents.updateInformations(documentInformations);
      await fsPromises.rename(req.file.path, `${SERVER.URL_DOCUMENTS}${documentInformations.filename}`);
      const addedDocument = await this.repositories.documents.getById(documentInformations.id);

      res.send(addedDocument);
    } catch (error) {
      HttpResolver.handle(
        error,
        `DocumentsService#add`,
        res
      );
    }
  }

}
