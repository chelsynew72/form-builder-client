'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { formsApi, submissionsApi } from '../../../lib/api';
import { PublicForm } from '@/components/forms/PublicForm';
import { Spinner } from '@/components/ui/Spinner';
import { AlertCircle } from 'lucide-react';

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.formId as string;

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      const response = await formsApi.getByPublicId(formId);
      setForm(response.data);
    } catch (error: any) {
      console.error('Failed to load form:', error);
      if (error.response?.status === 404) {
        setError('Form not found or has been disabled');
      } else {
        setError('Failed to load form. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-4">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Available</h1>
          <p className="text-gray-600">{error || 'This form could not be loaded.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <PublicForm form={form} />
    </div>
  );
}