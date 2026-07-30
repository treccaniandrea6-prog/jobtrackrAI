import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { CreateJobBody, JobFilters, JobStatus } from '../types/job.types';

export interface JobRow extends RowDataPacket {
  id: number;
  user_id: number;
  company: string;
  position: string;
  location: string | null;
  status: JobStatus;
  salary: string | null;
  job_url: string | null;
  description: string | null;
  notes: string | null;
  applied_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export const JobModel = {
  async findAllByUser(userId: number, filters: JobFilters): Promise<{ jobs: JobRow[]; total: number }> {
    const { status, search, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;
    const conditions: string[] = ['user_id = ?'];
    const params: (string | number)[] = [userId];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (search) {
      conditions.push('(company LIKE ? OR position LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const where = conditions.join(' AND ');
    const [jobs] = await pool.execute<JobRow[]>(
      `SELECT * FROM jobs WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [countRows] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM jobs WHERE ${where}`,
      params
    );
    return { jobs, total: countRows[0].total };
  },

  async findById(id: number, userId: number): Promise<JobRow | null> {
    const [rows] = await pool.execute<JobRow[]>(
      'SELECT * FROM jobs WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  },

  async create(userId: number, data: CreateJobBody): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO jobs (user_id, company, position, location, status, salary, job_url, description, notes, applied_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.company,
        data.position,
        data.location || null,
        data.status || 'wishlist',
        data.salary || null,
        data.jobUrl || null,
        data.description || null,
        data.notes || null,
        data.appliedAt || null,
      ]
    );
    return result.insertId;
  },

  async update(id: number, userId: number, data: Partial<CreateJobBody>): Promise<void> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.company !== undefined)     { fields.push('company = ?');     params.push(data.company); }
    if (data.position !== undefined)    { fields.push('position = ?');    params.push(data.position); }
    if (data.location !== undefined)    { fields.push('location = ?');    params.push(data.location ?? null); }
    if (data.status !== undefined)      { fields.push('status = ?');      params.push(data.status); }
    if (data.salary !== undefined)      { fields.push('salary = ?');      params.push(data.salary ?? null); }
    if (data.jobUrl !== undefined)      { fields.push('job_url = ?');     params.push(data.jobUrl ?? null); }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description ?? null); }
    if (data.notes !== undefined)       { fields.push('notes = ?');       params.push(data.notes ?? null); }
    if (data.appliedAt !== undefined)   { fields.push('applied_at = ?');  params.push(data.appliedAt ?? null); }

    if (fields.length === 0) return;
    fields.push('updated_at = NOW()');
    params.push(id, userId);

    await pool.execute(
      `UPDATE jobs SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );
  },

  async delete(id: number, userId: number): Promise<void> {
    await pool.execute(
      'DELETE FROM jobs WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  },

  async getStatsByUser(userId: number): Promise<RowDataPacket[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT status, COUNT(*) as count FROM jobs WHERE user_id = ? GROUP BY status',
      [userId]
    );
    return rows;
  },
};