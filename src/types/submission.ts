export interface Submission {
  _id: string;
  formId: string;
  data: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string;
  submittedAt: string;
  processedAt?: string;
}

export interface StepOutput {
  _id: string;
  submissionId: string;
  stepNumber: number;
  stepName: string;
  prompt: string;
  output: string;
  tokenCount?: number;
  duration?: number;
  model?: string;
  executedAt: string;
}