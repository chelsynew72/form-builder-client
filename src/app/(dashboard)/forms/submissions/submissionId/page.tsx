'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { submissionsApi, formsApi } from '../../../../../lib/api';
import { Button } from '@/components/ui/Button';
import { SubmissionDetail } from '@/components/submissions/SubmissionDetail';
import { ArrowLeft, Download, Trash2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Toast } from '@/components/ui/Toast';

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  const submissionId = params.submissionId as string;

  const [form, setForm] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [outputs, setOutputs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, [submissionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [formResponse, submissionResponse] = await Promise.all([
        formsApi.getOne(formId),
        submissionsApi.getOne(submissionId),
      ]);
      setForm(formResponse.data);
      setSubmission(submissionResponse.data.submission);
      setOutputs(submissionResponse.data.outputs);
    } catch (error) {
      console.error('Failed to load submission:', error);
      setToast({ message: 'Failed to load submission', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }

    try {
      await submissionsApi.delete(submissionId);
      setToast({ message: 'Submission deleted successfully', type: 'success' });
      setTimeout(() => {
        router.push(`/forms/${formId}/submissions`);
      }, 1500);
    } catch (error) {
      console.error('Failed to delete submission:', error);
      setToast({ message: 'Failed to delete submission', type: 'error' });
    }
  };

  const handleExport = () => {
    // Export as JSON
    const exportData = {
      form: form.name,
      submission: submission.data,
      outputs: outputs.map(o => ({
        step: o.stepNumber,
        name: o.stepName,
        output: o.output,
      })),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submission-${submissionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!submission || !form) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Submission not found</p>
        <Link href={`/forms/${formId}/submissions`}>
          <Button>Back to Submissions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href={`/forms/${formId}/submissions`}>
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Submissions
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Submission Details</h1>
            <p className="text-gray-600 mt-1">{form.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Submission Detail */}
      <SubmissionDetail
        submission={submission}
        outputs={outputs}
        formFields={form.fields}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}