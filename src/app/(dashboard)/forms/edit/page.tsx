'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { formsApi } from '../../../../lib/api';
import { Toast } from '@/components/ui/Toast';

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      const response = await formsApi.getOne(formId);
      setInitialData(response.data);
    } catch (error) {
      console.error('Failed to load form:', error);
      setToast({ message: 'Failed to load form', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      await formsApi.update(formId, formData);
      setToast({ message: 'Form updated successfully!', type: 'success' });
      setTimeout(() => {
        router.push('/forms');
      }, 1500);
    } catch (error) {
      console.error('Failed to update form:', error);
      setToast({ message: 'Failed to update form', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Form</h1>
        <p className="text-gray-600 mt-1">Update your form configuration</p>
      </div>

      <FormBuilder initialData={initialData} onSave={handleSave} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}