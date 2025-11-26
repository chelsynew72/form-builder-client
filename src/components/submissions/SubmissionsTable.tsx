'use client';

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/Button';
import { Eye } from 'lucide-react';
import { formatDateTime } from '../../components/lib/util';

interface SubmissionsTableProps {
  submissions: any[];
  formFields: any[];
  onViewDetails: (id: string) => void;
}

export function SubmissionsTable({ submissions, formFields, onViewDetails }: SubmissionsTableProps) {
  // Get first 2 fields for preview
  const previewFields = formFields.slice(0, 2);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Submitted At</TableHead>
            {previewFields.map(field => (
              <TableHead key={field.id}>{field.label}</TableHead>
            ))}
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map(submission => (
            <TableRow key={submission._id} onClick={() => onViewDetails(submission._id)}>
              <TableCell>
                <div className="text-sm text-gray-900">
                  {formatDateTime(submission.submittedAt)}
                </div>
              </TableCell>
              {previewFields.map(field => (
                <TableCell key={field.id}>
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {submission.data[field.id] || '-'}
                  </div>
                </TableCell>
              ))}
              <TableCell>
                <StatusBadge status={submission.status} />
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(submission._id);
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
