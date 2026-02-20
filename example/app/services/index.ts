import ConnexionService from './connexion/connexion.service.js';
import UsersService from './users/users.service.js';
import DocumentsService from './documents/documents.service.js';

export const SERVICES: unknown[] = [
  ConnexionService,
  UsersService,
  DocumentsService
];
