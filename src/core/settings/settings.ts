import dotenv from 'dotenv';
dotenv.config();

interface Settings {
  PORT: number;
  MONGO_URL: string;
  DB_NAME: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

const getSettings = (): Settings => {
  const mongoUrl = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;
  const nodeEnv = process.env.NODE_ENV as 'development' | 'production' | 'test';

  if (!mongoUrl) {
    throw new Error('❌ MONGO_URL is not defined in .env file');
  }

  if (!dbName) {
    throw new Error('❌ DB_NAME is not defined in .env file');
  }

  return {
    PORT: Number(process.env.PORT) || 5001,
    MONGO_URL: mongoUrl,
    DB_NAME: dbName,
    NODE_ENV: nodeEnv || 'development',
  };
};

export const SETTINGS = getSettings();
