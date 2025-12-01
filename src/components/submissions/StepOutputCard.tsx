'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

interface StepOutputCardProps {
  output: any;
  index: number;
}

export function StepOutputCard({ output, index }: StepOutputCardProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {output.stepNumber}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{output.stepName}</h3>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span>{formatDateTime(output.executedAt)}</span>
                {output.duration && <span>• {output.duration}ms</span>}
                {output.tokenCount && <span>• {output.tokenCount} tokens</span>}
                {output.model && <span>• {output.model}</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrompt(!showPrompt)}
            >
              {showPrompt ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Hide Prompt
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show Prompt
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showPrompt && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">PROMPT SENT TO AI:</p>
            <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap">{output.prompt}</p>
          </div>
        )}
        <div className="prose max-w-none">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-600 mb-2">AI OUTPUT:</p>
            <div className="text-gray-900 whitespace-pre-wrap">{output.output}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}