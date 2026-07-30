export type JobStatus =
  | 'wishlist'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface Job {
  id: number;
  userId: number;
  company: string;
  position: string;
  location: string | null;
  status: JobStatus;
  salary: string | null;
  jobUrl: string | null;
  description: string | null;
  notes: string | null;
  appliedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobBody {
  company: string;
  position: string;
  location?: string;
  status?: JobStatus;
  salary?: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  appliedAt?: string;
}

export interface UpdateJobBody extends Partial<CreateJobBody> {}

export interface JobFilters {
  status?: JobStatus;
  search?: string;
  page?: number;
  limit?: number;
}
