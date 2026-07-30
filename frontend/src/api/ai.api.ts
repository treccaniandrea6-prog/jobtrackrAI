import api from './axios.instance';

export interface CoverLetterParams {
  company: string;
  position: string;
  jobDescription?: string;
  userBackground?: string;
}

export interface AnalyzeJobParams {
  jobDescription: string;
}

export interface ImproveCvParams {
  cvText: string;
  targetRole?: string;
}

export interface InterviewQuestionsParams {
  position: string;
  company?: string;
  jobDescription?: string;
}

type AIResponse = { success: boolean; data: { result: string } };

export const aiApi = {
  coverLetter: (params: CoverLetterParams) =>
    api.post<AIResponse>('/ai/cover-letter', params),

  analyzeJob: (params: AnalyzeJobParams) =>
    api.post<AIResponse>('/ai/analyze-job', params),

  improveCv: (params: ImproveCvParams) =>
    api.post<AIResponse>('/ai/improve-cv', params),

  interviewQuestions: (params: InterviewQuestionsParams) =>
    api.post<AIResponse>('/ai/interview-questions', params),
};