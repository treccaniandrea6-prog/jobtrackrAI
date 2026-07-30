import { JobModel } from '../models/job.model';
import { AppError } from '../middleware/error.middleware';
import { CreateJobBody, JobFilters, UpdateJobBody } from '../types/job.types';

export const JobsService = {
  async getAll(userId: number, filters: JobFilters) {
    const { jobs, total } = await JobModel.findAllByUser(userId, filters);
    const { page = 1, limit = 10 } = filters;
    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: number, userId: number) {
    const job = await JobModel.findById(id, userId);
    if (!job) throw new AppError('Job not found', 404);
    return job;
  },

  async create(userId: number, data: CreateJobBody) {
    const jobId = await JobModel.create(userId, data);
    return JobModel.findById(jobId, userId);
  },

  async update(id: number, userId: number, data: UpdateJobBody) {
    await JobModel.findById(id, userId);
    await JobModel.update(id, userId, data);
    return JobModel.findById(id, userId);
  },

  async delete(id: number, userId: number) {
    const job = await JobModel.findById(id, userId);
    if (!job) throw new AppError('Job not found', 404);
    await JobModel.delete(id, userId);
  },

  async getStats(userId: number) {
    const rows = await JobModel.getStatsByUser(userId);
    const stats = {
      total: 0,
      wishlist: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    rows.forEach((row) => {
      const status = row.status as keyof typeof stats;
      stats[status] = row.count;
      stats.total += row.count;
    });
    return stats;
  },
};
