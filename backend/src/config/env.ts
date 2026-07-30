import dotenv from 'dotenv';
dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    HOST: requireEnv('DB_HOST'),
    PORT: parseInt(process.env.DB_PORT || '3306', 10),
    USER: requireEnv('DB_USER'),
    PASSWORD: requireEnv('DB_PASSWORD'),
    NAME: requireEnv('DB_NAME'),
  },
  JWT: {
    SECRET: requireEnv('JWT_SECRET'),
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
};