'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { StatusBadge } from './StatusBadge';
import { StepOutputCard } from './StepOutputCard';
import { formatDateTime } from '../../components/lib/util';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface SubmissionDetailProps {
  submission: any;
  outputs: any[];
  formFields: any[];
}

export function SubmissionDetail({ submission, outputs, formFields }: SubmissionDetailProps) {
  return (
    <div className="space-y-6">
      {/* Submission Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Submission Information</h2>
            <StatusBadge status={submission.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Submission ID</p>
              <p className="font-mono text-sm text-gray-900">{submission._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Submitted At</p>
              <p className="text-sm text-gray-900">{formatDateTime(submission.submittedAt)}</p>
            </div>
            {submission.processedAt && (
              <div>
                <p className="text-sm text-gray-600">Processed At</p>
                <p className="text-sm text-gray-900">{formatDateTime(submission.processedAt)}</p>
              </div>
            )}
            {submission.ipAddress && (
              <div>
                <p className="text-sm text-gray-600">IP Address</p>
                <p className="text-sm text-gray-900">{submission.ipAddress}</p>
              </div>
            )}
          </div>

          {submission.status === 'failed' && submission.errorMessage && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 text-sm">Processing Error</p>
                <p className="text-sm text-red-800 mt-1">{submission.errorMessage}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Data */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Form Data</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formFields.map(field => (
              <div key={field.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <p className="text-sm font-medium text-gray-600 mb-1">{field.label}</p>
                <p className="text-gray-900">
                  {submission.data[field.id] ? (
                    Array.isArray(submission.data[field.id]) ? (
                      submission.data[field.id].join(', ')
                    ) : (
                      submission.data[field.id]
                    )
                  ) : (
                    <span className="text-gray-400 italic">No response</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Pipeline Outputs */}
      {outputs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Processing Pipeline</h2>
          <div className="space-y-4">
            {outputs.map((output, index) => (
              <StepOutputCard key={output._id} output={output} index={index} />
            ))}
          </div>
        </div>
      )}

      {outputs.length === 0 && submission.status === 'completed' && (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No AI pipeline configured for this form</p>
            </div>
          </CardContent>
        </Card>
      )}

      {submission.status === 'processing' && (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3 animate-pulse" />
              <p className="text-gray-900 font-medium mb-1">Processing in progress...</p>
              <p className="text-sm text-gray-600">The AI pipeline is currently processing this submission</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}