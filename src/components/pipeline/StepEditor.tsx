'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { PipelineStep } from '@/types/pipeline';

interface StepEditorProps {
  step: PipelineStep;
  stepIndex: number;
  formFields: Array<{ id: string; label: string; type: string }>;
  previousSteps: PipelineStep[];
  onSave: (step: PipelineStep) => void;
  onCancel: () => void;
}

export function StepEditor({
  step,
  stepIndex,
  formFields,
  previousSteps,
  onSave,
  onCancel
}: StepEditorProps) {
  
  const [editedStep, setEditedStep] = useState<PipelineStep>({
    ...step,
    model: 'gemini-2.5-flash', 
  });

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('prompt-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = editedStep.prompt;
      const before = text.substring(0, start);
      const after = text.substring(end);

      setEditedStep({
        ...editedStep,
        prompt: before + `{${variable}}` + after,
      });

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2);
      }, 0);
    }
  };

  const handleSave = () => {
    if (!editedStep.name.trim()) {
      alert('Step name is required');
      return;
    }
    if (!editedStep.prompt.trim()) {
      alert('Step prompt is required');
      return;
    }

    onSave({
      ...editedStep,
      model: 'gemini-2.5-flash', 
    });
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title={`Edit Step ${stepIndex + 1}`} size="xl">
      <div className="space-y-4">
        
        <Input
          label="Step Name"
          value={editedStep.name}
          onChange={(e) => setEditedStep({ ...editedStep, name: e.target.value })}
          placeholder="e.g., Generate Response Email"
          required
        />

        <Textarea
          label="Description"
          value={editedStep.description || ''}
          onChange={(e) => setEditedStep({ ...editedStep, description: e.target.value })}
          placeholder="Optional description"
          rows={2}
        />

        {/* Insert Variables */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insert Variables
          </label>
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
            
            <Button
              type="button"
              onClick={() => insertVariable('all_fields')}
              variant="outline"
              size="sm"
            >
              {'{all_fields}'}
            </Button>

            {formFields.map(field => (
              <Button
                key={field.id}
                type="button"
                onClick={() => insertVariable(field.id)}
                variant="outline"
                size="sm"
                title={field.label}
              >
                {`{${field.id}}`}
              </Button>
            ))}

            {previousSteps.map((prevStep, idx) => (
              <Button
                key={idx}
                type="button"
                onClick={() => insertVariable(`step_${idx + 1}_output`)}
                variant="outline"
                size="sm"
                className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              >
                {`{step_${idx + 1}_output}`}
              </Button>
            ))}

          </div>
          <p className="text-xs text-gray-500 mt-1">
            Click a variable to insert it at cursor position in the prompt
          </p>
        </div>

        {/* Prompt */}
        <Textarea
          id="prompt-textarea"
          label="AI Prompt"
          value={editedStep.prompt}
          onChange={(e) => setEditedStep({ ...editedStep, prompt: e.target.value })}
          placeholder="Enter your AI prompt here..."
          rows={8}
          className="font-mono text-sm"
          required
        />

        {/* Example */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 text-sm mb-2"> Example Prompt</h4>
          <p className="text-sm text-blue-800 font-mono">
            "Write a professional response email to {'{name}'} regarding their message: {'{message}'}. 
            Keep the tone friendly and helpful."
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Step
          </Button>
        </div>

      </div>
    </Modal>
  );
}
