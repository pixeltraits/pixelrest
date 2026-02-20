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
  host: process.env.SERVER_HOST || '0.0.0.0',
  port: Number(process.env.SERVER_PORT) || 1338,
  uploadDirectory: new URL('../../documents/', import.meta.url) as URL,
  urlDocuments: 'documents/',
  allowedMimetypesDocuments: [
    'image/png'
  ],
  maxJsonRequestSize: '2mb',
  corsOrigin: '*'
};
