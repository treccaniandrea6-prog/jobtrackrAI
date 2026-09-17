import Groq from 'groq-sdk';
import { env } from '../config/env';
import { AppError } from '../middleware/error.middleware';

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

const MODEL = 'openai/gpt-oss-120b';

const askAI = async (prompt: string): Promise<string> => {
  if (!env.GROQ_API_KEY) {
    throw new AppError('AI service is not configured', 503);
  }
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) {
      throw new AppError('AI returned an empty response', 502);
    }
    return text;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Groq API error:', error);
    throw new AppError('AI request failed', 502);
  }
};

export const AIService = {
  async generateCoverLetter(params: {
    company: string;
    position: string;
    jobDescription?: string;
    userBackground?: string;
  }): Promise<string> {
    const prompt = `Write a professional, compelling cover letter for the following job application.

Company: ${params.company}
Position: ${params.position}
${params.jobDescription ? `Job Description: ${params.jobDescription}` : ''}
${params.userBackground ? `Candidate Background: ${params.userBackground}` : ''}

Write a concise, personalized cover letter (3-4 paragraphs). Do not include placeholder brackets - write it as a complete, ready-to-use letter. Do not include a header with addresses or dates, just the letter body starting with "Dear Hiring Manager," and ending with a sign-off.`;
    return askAI(prompt);
  },

  async analyzeJobDescription(jobDescription: string): Promise<string> {
    const prompt = `Analyze the following job description and provide a structured summary with:
1. Key required skills and qualifications
2. Nice-to-have skills
3. Main responsibilities
4. Potential red flags or things to clarify
5. A short assessment of seniority level

Job Description:
${jobDescription}

Format your response with clear headings using markdown.`;
    return askAI(prompt);
  },

  async improveCv(cvText: string, targetRole?: string): Promise<string> {
    const prompt = `Review the following CV/resume content and provide specific, actionable improvement suggestions.
${targetRole ? `The candidate is targeting this role: ${targetRole}` : ''}

CV content:
${cvText}

Provide:
1. Overall impression (2-3 sentences)
2. Specific improvements (bullet points) - phrasing, structure, missing info
3. Suggested action verbs or keywords to add
4. Formatting/structure recommendations

Format your response with clear headings using markdown.`;
    return askAI(prompt);
  },

  async generateInterviewQuestions(params: {
    position: string;
    company?: string;
    jobDescription?: string;
  }): Promise<string> {
    const prompt = `Generate a list of likely interview questions for the following job application, organized by category.

Position: ${params.position}
${params.company ? `Company: ${params.company}` : ''}
${params.jobDescription ? `Job Description: ${params.jobDescription}` : ''}

Provide:
1. 4-5 General/behavioral questions
2. 4-5 Technical/role-specific questions
3. 2-3 Questions about the company/culture fit
4. 2-3 Good questions for the candidate to ask the interviewer

Format your response with clear headings using markdown.`;
    return askAI(prompt);
  },
};
