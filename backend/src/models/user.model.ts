import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface UserRow extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export const UserModel = {
  async findByEmail(email: string): Promise<UserRow | null> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  async findById(id: number): Promise<UserRow | null> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT id, first_name, last_name, email, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create(
    firstName: string,
    lastName: string,
    email: string,
    hashedPassword: string
  ): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword]
    );
    return result.insertId;
  },

  async updateProfile(
    id: number,
    firstName: string,
    lastName: string
  ): Promise<void> {
    await pool.execute(
      'UPDATE users SET first_name = ?, last_name = ?, updated_at = NOW() WHERE id = ?',
      [firstName, lastName, id]
    );
  },
};
