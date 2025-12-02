'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formsApi, submissionsApi } from '../../../../../lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '../../../../../components/submissions/StatusBadge';
import { SubmissionsTable } from '@/components/submissions/SubmissionsTable';
import { ArrowLeft, Search, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { formatDateTime } from '../../../../../lib/utils';

export default function SubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy] = useState('submittedAt');
  const [sortOrder] = useState('desc');

  useEffect(() => {
    loadForm();
  }, [formId]);

  useEffect(() => {
    if (form) {
      loadSubmissions();
    }
  }, [form, page, status, search]);

  const loadForm = async () => {
    try {
      const response = await formsApi.getOne(formId);
      setForm(response.data);
    } catch (error) {
      console.error('Failed to load form:', error);
    }
  };

  const loadSubmissions = async () => {
  setLoading(true);
  try {
    console.log('🔍 Loading submissions for formId:', formId); // Add this
    const response = await submissionsApi.getByFormId(formId, {
      page,
      limit,
      status: status || undefined,
      search: search || undefined,
      sortBy,
      sortOrder,
    });
    console.log('📊 Submissions response:', response.data); // Add this
    setSubmissions(response.data.data);
    setTotal(response.data.total);
  } catch (error) {
    console.error('Failed to load submissions:', error);
  } finally {
    setLoading(false);
  }
};
  const handleExport = async () => {
    try {
      // Would implement CSV/JSON export
      alert('Export functionality coming soon!');
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  if (!form) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/forms">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
            <p className="text-gray-600 mt-1">
              {form.name} • {total} total submission{total !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadSubmissions}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search submissions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            options={statusOptions}
          />
          <div className="flex items-center text-sm text-gray-600">
            Showing {submissions.length} of {total} submissions
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions yet</h3>
          <p className="text-gray-600 mb-6">
            {search || status
              ? 'No submissions match your filters'
              : 'Share your form to start receiving submissions'}
          </p>
          {!search && !status && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800 mb-2">Public Form URL:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/f/${form.publicId}`}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/f/${form.publicId}`);
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <SubmissionsTable
            submissions={submissions}
            formFields={form.fields}
            onViewDetails={(id) => router.push(`/forms/${formId}/submissions/${id}`)}
          />

          {/* Pagination */}
          {total > limit && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * limit >= total}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}