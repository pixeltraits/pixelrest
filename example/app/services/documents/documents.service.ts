import fsPromises from 'fs/promises';
import type { Request, Response } from 'express';

import Document from '../../utils/Document.js';
import { addSchema } from './documents.schema.js';
import type DocumentsRepository from '../../repositories/documents.repository.js';
import Service from '../../../../src/nodeExpress/Service.js';
import { RouteConfig } from '../../../../src/types.js';
import { serverConfig } from '../../config/serverConfig.js';
import { ROLES } from '../../config/roles.js';
import HttpResolver from '../../../../src/loggers/HttpResolver.js';
import { HTTP_METHODS } from '../../../../src/nodeExpress/http-methods.config.js';


export default class DocumentsService extends Service {
  protected routesConfig: RouteConfig[] = [
    {
      route: '/documents',
      execute: 'add',
      method: HTTP_METHODS.POST,
      multerConfig: {
        uploadDirectory: 'temp',
        documentFieldName: 'fileDocument',
        multerMethodName: 'single',
        limits: {
          fieldSize: 2000000,
          fileSize: 100000000
        },
        allowedMimeTypes: serverConfig.allowedMimetypesDocuments
      },
      schema: addSchema,
      roles: [ROLES.ADMIN]
    }
  ];

  constructor(tokenSecret: string) {
    super(tokenSecret);
  }

  private get documentsRepo(): DocumentsRepository {
    return this.repositories.documents as DocumentsRepository;
  }

  async add(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as { name: string; description: string };
      const file = req.file as Express.Multer.File;

      const documentInformations = {
        id: null as number | null,
        name: body.name,
        description: body.description,
        filename: ''
      };
      documentInformations.id = await this.documentsRepo.add(documentInformations);
      documentInformations.filename = Document.getDocumentFileNewName(file, documentInformations.id);
      await this.documentsRepo.updateInformations(documentInformations);
      await fsPromises.rename(file.path, `${serverConfig.urlDocuments}${documentInformations.filename}`);
      const addedDocument = await this.documentsRepo.getById(documentInformations.id);

      res.send(addedDocument);
    } catch (error) {
      HttpResolver.handle(error as { type: string; message: string }, `DocumentsService#add`, res);
    }
  }

}
