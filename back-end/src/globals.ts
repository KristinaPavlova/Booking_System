// Move dbConfig into this file or load it from a separate config file
import DbHandler from './handlers/database-handler';

const dbConfig = {
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_USER_PASSWORD || '',
    database: process.env.DB_NAME || '',
  };
  
export const db = new DbHandler(dbConfig);
