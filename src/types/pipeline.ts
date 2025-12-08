export interface PipelineStep {
  stepNumber: number;
  name: string;
  prompt: string;
  description?: string;
  model?: string;
}

export interface Pipeline {
  _id: string;
  formId: string;
  name: string;
  steps: PipelineStep[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}