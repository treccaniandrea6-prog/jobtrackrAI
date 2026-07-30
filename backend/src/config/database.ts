import mysql from 'mysql2/promise';
import { env } from './env';

export const pool = mysql.createPool({
  host: env.DB.HOST,
  port: env.DB.PORT,
  user: env.DB.USER,
  password: env.DB.PASSWORD,
  database: env.DB.NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
});

export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};
