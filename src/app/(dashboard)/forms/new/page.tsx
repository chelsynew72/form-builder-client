'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '../../../../components/forms/FormBuilder';
import { formsApi } from '../../../../lib/api';
import { Toast } from '../../../../components/ui/Toast';

export default function NewFormPage() {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async (formData: any) => {
    try {
      const response = await formsApi.create(formData);
      setToast({ message: 'Form created successfully!', type: 'success' });
      setTimeout(() => {
        router.push(`/forms/${response.data._id}/pipeline`);
      }, 1500);
    } catch (error) {
      console.error('Failed to create form:', error);
      setToast({ message: 'Failed to create form', type: 'error' });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Form</h1>
        <p className="text-gray-600 mt-1">Build your AI-powered form</p>
      </div>

      <FormBuilder onSave={handleSave} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
