export const DB_CREDENTIALS = {
  HOST: process.env.MYSQL_HOST,
  PORT: Number(process.env.MYSQL_PORT),
  USERNAME: process.env.MYSQL_USER,
  PASSWORD: process.env.MYSQL_PASSWORD,
  DATABASE: process.env.MYSQL_DATABASE
};

export const PG_CREDENTIALS = {
  HOST: process.env.POSTGRES_HOST,
  PORT: Number(process.env.POSTGRES_PORT),
  USERNAME: process.env.POSTGRES_USER,
  PASSWORD: process.env.POSTGRES_PASSWORD,
  DATABASE: process.env.POSTGRES_DB
};

export const JWT = {
  SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN)
};
