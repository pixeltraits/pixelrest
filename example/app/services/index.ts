import ConnexionService from './connexion/connexion.service.js';
import UsersService from './users/users.service.js';
import DocumentsService from './documents/documents.service.js';
import type { Router } from 'express';

type ServiceCtor = new (tokenSecret: string) => {
  setRepositories(repositories: Record<string, unknown>): void;
  getRouter(): Router;
};

export const SERVICES: ServiceCtor[] = [
  ConnexionService,
  UsersService,
  DocumentsService
];
