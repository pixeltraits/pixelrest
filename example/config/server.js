export const SERVER = {
  HOST: `localhost`,
  PORT: 1338,
  UPLOAD_DIRECTORY: new URL(`../../documents/`, import.meta.url),
  URL_DOCUMENTS: `documents/`,
  ALLOWED_MIMETYPES_DOCUMENTS: [
    `image/png`,
    `image/gif`,
    `image/jpeg`,
    `application/msword`,
    `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
    `application/vnd.oasis.opendocument.spreadsheet`,
    `application/vnd.oasis.opendocument.text`,
    `application/vnd.ms-powerpoint`,
    `application/vnd.openxmlformats-officedocument.presentationml.presentation`,
    `application/vnd.ms-excel`,
    `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
    `application/pdf`,
    `application/x-rar-compressed`,
    `application/zip`
  ],
  MAX_JSON_REQUEST_SIZE: `2mb`
};
