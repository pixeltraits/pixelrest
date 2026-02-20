export interface ServerConfig {
  host: string;
  port: number;
  uploadDirectory: URL;
  urlDocuments: string;
  allowedMimetypesDocuments: string[];
  maxJsonRequestSize: string;
  corsOrigin: string;
}

export const serverConfig: ServerConfig = {
  host: 'localhost',
  port: 1338,
  uploadDirectory: new URL('../../documents/', import.meta.url) as URL,
  urlDocuments: 'documents/',
  allowedMimetypesDocuments: [
    'image/png'
  ],
  maxJsonRequestSize: '2mb',
  corsOrigin: '*'
};
