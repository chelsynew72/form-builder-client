export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: string[];
  helpText?: string;
  order: number;
}

export interface Form {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  fields: FormField[];
  publicId: string;
  isActive: boolean;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormDto {
  name: string;
  description?: string;
  fields: FormField[];
}