export const SERVER = {
  HOST: `localhost`,
  PORT: 1338,
  UPLOAD_DIRECTORY: new URL(`../../documents/`, import.meta.url),
  URL_DOCUMENTS: `documents/`,
  ALLOWED_MIMETYPES_DOCUMENTS: [
    `image/png`
  ],
  MAX_JSON_REQUEST_SIZE: `2mb`,
  // WARNING: '*' allows all origins. In production, restrict to your domain (e.g. 'https://myapp.com')
  CORS_ORIGIN: `*`
};
