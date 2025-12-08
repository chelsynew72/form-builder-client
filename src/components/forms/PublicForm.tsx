'use client';

import { useState } from 'react';
import { submissionsApi } from '../../lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert } from '@/components/ui/Alert';
import { FormField } from '@/types/form';
import { CheckCircle, Send } from 'lucide-react';

interface PublicFormProps {
  form: any;
}

export function PublicForm({ form }: PublicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    form.fields.forEach((field: FormField) => {
      const value = formData[field.id];

      // Required field validation
      if (field.required && (!value || value.toString().trim() === '')) {
        newErrors[field.id] = `${field.label} is required`;
        return;
      }

      if (value) {
        // Email validation
        if (field.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors[field.id] = 'Please enter a valid email address';
          }
        }

        // Number validation
        if (field.type === 'number' && value) {
          if (isNaN(value)) {
            newErrors[field.id] = 'Please enter a valid number';
          }
        }

        // Text length validation
        if ((field.type === 'text' || field.type === 'textarea') && field.validation) {
          if (field.validation.min && value.length < field.validation.min) {
            newErrors[field.id] = `Minimum ${field.validation.min} characters required`;
          }
          if (field.validation.max && value.length > field.validation.max) {
            newErrors[field.id] = `Maximum ${field.validation.max} characters allowed`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submissionsApi.create({
        formId: form._id,
        data: formData,
      });

      setSubmitted(true);
      setSubmissionId(response.data.submissionId);
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      label: field.label,
      required: field.required,
      error: errors[field.id],
      helperText: field.helpText,
    };

    switch (field.type) {
      case 'text':
        return (
          <Input
            key={field.id}
            {...commonProps}
            type="text"
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case 'email':
        return (
          <Input
            key={field.id}
            {...commonProps}
            type="email"
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            key={field.id}
            {...commonProps}
            type="number"
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case 'date':
        return (
          <Input
            key={field.id}
            {...commonProps}
            type="date"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <Textarea
            key={field.id}
            {...commonProps}
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            rows={5}
          />
        );

      case 'select':
        return (
          <Select
            key={field.id}
            {...commonProps}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            options={field.options?.map(opt => ({ value: opt, label: opt })) || []}
          />
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.options?.map(option => (
              <Checkbox
                key={option}
                label={option}
                checked={(formData[field.id] || []).includes(option)}
                onChange={(e) => {
                  const currentValues = formData[field.id] || [];
                  const newValues = e.target.checked
                    ? [...currentValues, option]
                    : currentValues.filter((v: string) => v !== option);
                  handleFieldChange(field.id, newValues);
                }}
              />
            ))}
            {errors[field.id] && (
              <p className="text-sm text-red-600">{errors[field.id]}</p>
            )}
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.options?.map(option => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
            {errors[field.id] && (
              <p className="text-sm text-red-600">{errors[field.id]}</p>
            )}
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your submission has been received successfully.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 mb-1">Submission ID</p>
            <p className="font-mono text-sm text-blue-700">{submissionId}</p>
          </div>

          <Alert type="info">
            <div className="text-left">
              <p className="font-semibold mb-1">What happens next?</p>
              <p className="text-sm">
                Your submission is being processed through our AI pipeline. 
                The form owner will review the results and get back to you if needed.
              </p>
            </div>
          </Alert>

          <div className="mt-6">
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({});
                setSubmissionId(null);
              }}
            >
              Submit Another Response
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">{form.name}</h1>
          {form.description && (
            <p className="text-blue-100">{form.description}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {form.fields
            .sort((a: FormField, b: FormField) => a.order - b.order)
            .map((field: FormField) => renderField(field))}

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Form
                </>
              )}
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="text-center text-xs text-gray-500">
            <p>This form is powered by AI Form Pipeline</p>
            <p className="mt-1">Your submission will be processed securely</p>
          </div>
        </form>
      </div>
    </div>
  );
}