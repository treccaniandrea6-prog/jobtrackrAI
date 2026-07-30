export type JobStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

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
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobForm {
  company: string;
  position: string;
  location?: string;
  status: JobStatus;
  salary?: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  appliedAt?: string;
}

export interface JobStats {
  total: number;
  wishlist: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
