import UsersRepository from './users/users.repository.js';
import DocumentsRepository from './documents/documents.repository.js';


export const REPOSITORIES = {
  users: UsersRepository,
  documents: DocumentsRepository
};
