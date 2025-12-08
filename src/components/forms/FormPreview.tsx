'use client';

import { FormField } from '@/types/form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

interface FormPreviewProps {
  formName: string;
  formDescription: string;
  fields: FormField[];
}

export function FormPreview({ formName, formDescription, fields }: FormPreviewProps) {
  const renderField = (field: FormField) => {
    const commonProps = {
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      helperText: field.helpText,
      disabled: true, // Preview mode
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return <Input key={field.id} {...commonProps} type={field.type} />;

      case 'textarea':
        return <Textarea key={field.id} {...commonProps} rows={5} />;

      case 'select':
        return (
          <Select
            key={field.id}
            {...commonProps}
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
              <Checkbox key={option} label={option} disabled />
            ))}
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
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  disabled
                  className="w-4 h-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">{formName || 'Form Preview'}</h2>
          {formDescription && (
            <p className="text-blue-100 mt-1">{formDescription}</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="px-6 py-4 space-y-4">
          {fields.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No fields added yet. Add fields to see the preview.
            </p>
          ) : (
            fields
              .sort((a, b) => a.order - b.order)
              .map(field => renderField(field))
          )}

          {fields.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <Button disabled className="w-full" size="lg">
                Submit Form
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}