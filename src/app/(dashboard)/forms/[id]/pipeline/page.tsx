'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PipelineBuilder } from '@/components/pipeline/PipelineBuilder';
import { formsApi, pipelinesApi } from '../../../../../lib/api';
import { Toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PipelinePage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;
  const [form, setForm] = useState<any>(null);
  const [pipeline, setPipeline] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, [formId]);

  const loadData = async () => {
    try {
      const [formResponse, pipelineResponse] = await Promise.all([
        formsApi.getOne(formId),
        pipelinesApi.getByFormId(formId).catch(() => ({ data: null })),
      ]);
      setForm(formResponse.data);
      setPipeline(pipelineResponse.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      setToast({ message: 'Failed to load form or pipeline', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (steps: any[]) => {
    try {
      const pipelineData = {
        formId,
        name: `${form.name} Pipeline`,
        steps,
      };

      if (pipeline) {
        await pipelinesApi.update(formId, pipelineData);
        setToast({ message: 'Pipeline updated successfully!', type: 'success' });
      } else {
        await pipelinesApi.create(pipelineData);
        setToast({ message: 'Pipeline created successfully!', type: 'success' });
      }
      
      setTimeout(() => {
        router.push('/forms');
      }, 1500);
    } catch (error) {
      console.error('Failed to save pipeline:', error);
      setToast({ message: 'Failed to save pipeline', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Form not found</p>
        <Link href="/forms">
          <Button>Back to Forms</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/forms">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Configure AI Pipeline</h1>
        <p className="text-gray-600 mt-1">Set up AI processing steps for: {form.name}</p>
      </div>

      <PipelineBuilder
        formFields={form.fields}
        initialSteps={pipeline?.steps || []}
        onSave={handleSave}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}