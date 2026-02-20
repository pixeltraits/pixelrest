export const DB_TYPE = process.env.DB_TYPE || 'mysql';
export const isPostgres = DB_TYPE === 'postgres';
