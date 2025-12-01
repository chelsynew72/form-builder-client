'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '../../../components/ui/Button';
import { formsApi, submissionsApi } from '../../../lib/api';
import { FileText, Send, CheckCircle, Clock, Plus } from 'lucide-react';
import Link from 'next/link';
import { formatDateTime } from '../../../lib/utils';

interface DashboardStats {
  totalForms: number;
  totalSubmissions: number;
  activeProcessing: number;
  completedToday: number;
}

interface RecentActivity {
  id: string;
  type: 'form_created' | 'submission_received' | 'processing_completed';
  title: string;
  description: string;
  timestamp: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalForms: 0,
    totalSubmissions: 0,
    activeProcessing: 0,
    completedToday: 0,
  });
  const [recentForms, setRecentForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const formsResponse = await formsApi.getAll();
      const forms = formsResponse.data;

      // Calculate stats
      let totalSubmissions = 0;
      forms.forEach((form: any) => {
        totalSubmissions += form.submissionCount || 0;
      });

      setStats({
        totalForms: forms.length,
        totalSubmissions,
        activeProcessing: 0, // Would need to aggregate from submissions
        completedToday: 0, // Would need to filter by date
      });

      setRecentForms(forms.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Link href="/forms/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Forms"
          value={stats.totalForms}
          icon={FileText}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          icon={Send}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Processing"
          value={stats.activeProcessing}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Completed Today"
          value={stats.completedToday}
          icon={CheckCircle}
          color="purple"
        />
      </div>

      {/* Recent Forms */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Forms</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentForms.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No forms created yet</p>
              <Link href="/forms/new">
                <Button>Create Your First Form</Button>
              </Link>
            </div>
          ) : (
            recentForms.map((form) => (
              <div
                key={form._id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => router.push(`/forms/${form._id}/submissions`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{form.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {form.description || 'No description'}
                    </p>
                    <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                      <span>Created {formatDateTime(form.createdAt)}</span>
                      <span>•</span>
                      <span>{form.submissionCount || 0} submissions</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/forms/${form._id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Link href={`/forms/${form._id}/submissions`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {recentForms.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Link href="/forms">
              <Button variant="ghost" className="w-full">
                View All Forms
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/forms/new" className="block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create New Form</h3>
            <p className="text-sm text-gray-600">
              Build a new form with AI-powered processing pipeline
            </p>
          </div>
        </Link>

        <Link href="/forms" className="block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Manage Forms</h3>
            <p className="text-sm text-gray-600">
              View, edit, and configure your existing forms
            </p>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Send className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">View Analytics</h3>
          <p className="text-sm text-gray-600">
            See detailed insights about your form submissions
          </p>
        </div>
      </div>
    </div>
  );
}