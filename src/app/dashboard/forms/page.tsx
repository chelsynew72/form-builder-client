'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formsApi } from '../../../components/lib/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Plus, Search, MoreVertical, Edit, Trash2, Copy, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDateTime, copyToClipboard } from '../../../components/lib/util';
import { Toast } from '@/components/ui/Toast';

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<any[]>([]);
  const [filteredForms, setFilteredForms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = forms.filter(form =>
        form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredForms(filtered);
    } else {
      setFilteredForms(forms);
    }
  }, [searchQuery, forms]);

  const loadForms = async () => {
    try {
      const response = await formsApi.getAll();
      setForms(response.data);
      setFilteredForms(response.data);
    } catch (error) {
      console.error('Failed to load forms:', error);
      setToast({ message: 'Failed to load forms', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async (publicId: string) => {
    const link = `${window.location.origin}/f/${publicId}`;
    const success = await copyToClipboard(link);
    if (success) {
      setToast({ message: 'Link copied to clipboard!', type: 'success' });
    } else {
      setToast({ message: 'Failed to copy link', type: 'error' });
    }
  };

  const handleDelete = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }

    try {
      await formsApi.delete(formId);
      setToast({ message: 'Form deleted successfully', type: 'success' });
      loadForms();
    } catch (error) {
      console.error('Failed to delete form:', error);
      setToast({ message: 'Failed to delete form', type: 'error' });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-600 mt-1">Manage your AI-powered forms</p>
        </div>
        <Link href="/forms/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No forms yet</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery ? 'No forms match your search' : 'Create your first AI-powered form to get started'}
          </p>
          {!searchQuery && (
            <Link href="/forms/new">
              <Button>Create Your First Form</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{form.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {form.description || 'No description'}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === form._id ? null : form._id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeMenu === form._id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveMenu(null)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={() => {
                              router.push(`/forms/${form._id}/edit`);
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleCopyLink(form.publicId);
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </button>
                          <button
                            onClick={() => {
                              window.open(`/f/${form.publicId}`, '_blank');
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => {
                              handleDelete(form._id);
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{form.fields?.length || 0} fields</span>
                  <Badge variant={form.isActive ? 'success' : 'default'}>
                    {form.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Submissions</span>
                    <span className="font-semibold text-gray-900">{form.submissionCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Created</span>
                    <span className="text-gray-900">{formatDateTime(form.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/forms/${form._id}/pipeline`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Pipeline
                    </Button>
                  </Link>
                  <Link href={`/forms/${form._id}/submissions`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Submissions
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}