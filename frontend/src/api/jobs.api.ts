import api from './axios.instance';
import type { Job, CreateJobForm, JobStats, JobsResponse } from '../types/job.types';

export const jobsApi = {
  getAll: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    api.get<{ success: boolean; data: JobsResponse }>('/jobs', { params }),

  getById: (id: number) =>
    api.get<{ success: boolean; data: Job }>(`/jobs/${id}`),

  create: (data: CreateJobForm) =>
    api.post<{ success: boolean; data: Job }>('/jobs', data),

  update: (id: number, data: Partial<CreateJobForm>) =>
    api.put<{ success: boolean; data: Job }>(`/jobs/${id}`, data),

  delete: (id: number) =>
    api.delete<{ success: boolean }>(`/jobs/${id}`),

  getStats: () =>
    api.get<{ success: boolean; data: JobStats }>('/jobs/stats'),
};
