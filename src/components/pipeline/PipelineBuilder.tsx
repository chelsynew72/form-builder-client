
'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PipelineStep } from '../../types/pipeline';
import { nanoid } from 'nanoid';

interface PipelineBuilderProps {
  formFields: Array<{ id: string; label: string }>;
  initialSteps?: PipelineStep[];
  onSave: (steps: PipelineStep[]) => Promise<void>;
}

export function PipelineBuilder({ formFields, initialSteps, onSave }: PipelineBuilderProps) {
  const [steps, setSteps] = useState<PipelineStep[]>(initialSteps || []);
  const [isSaving, setIsSaving] = useState(false);

  const addStep = () => {
    const newStep: PipelineStep = {
      stepNumber: steps.length + 1,
      name: `Step ${steps.length + 1}`,
      prompt: '',
      description: '',
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (index: number, updates: Partial<PipelineStep>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setSteps(newSteps);
  };

  const deleteStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    // Renumber steps
    setSteps(newSteps.map((step, i) => ({ ...step, stepNumber: i + 1 })));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    
    // Renumber
    setSteps(newSteps.map((step, i) => ({ ...step, stepNumber: i + 1 })));
  };

  const insertVariable = (stepIndex: number, variable: string) => {
    const step = steps[stepIndex];
    updateStep(stepIndex, {
      prompt: step.prompt + `{${variable}}`,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(steps);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">AI Processing Pipeline</h2>
          <Button onClick={addStep}>+ Add Step</Button>
        </div>

        {steps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">No pipeline steps configured yet.</p>
            <p className="text-sm">Click "Add Step" to create your first AI processing step.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg font-bold text-blue-600">
                        Step {step.stepNumber}
                      </span>
                      <Input
                        value={step.name}
                        onChange={(e) => updateStep(index, { name: e.target.value })}
                        placeholder="Step name"
                        className="max-w-xs"
                      />
                    </div>
                    <Input
                      value={step.description || ''}
                      onChange={(e) => updateStep(index, { description: e.target.value })}
                      placeholder="Optional description"
                      className="mb-3"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => moveStep(index, 'up')}
                      disabled={index === 0}
                      variant="outline"
                      size="sm"
                    >
                      ↑
                    </Button>
                    <Button
                      onClick={() => moveStep(index, 'down')}
                      disabled={index === steps.length - 1}
                      variant="outline"
                      size="sm"
                    >
                      ↓
                    </Button>
                    <Button
                      onClick={() => deleteStep(index)}
                      variant="outline"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Prompt
                  </label>
                  <textarea
                    value={step.prompt}
                    onChange={(e) => updateStep(index, { prompt: e.target.value })}
                    placeholder="Enter your AI prompt here. Use variables like {field_name}, {step_1_output}, {all_fields}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    rows={6}
                  />
                </div>

                <div className="border-t border-gray-300 pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Insert Variables:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => insertVariable(index, 'all_fields')}
                      variant="outline"
                      size="sm"
                    >
                      {'{all_fields}'}
                    </Button>
                    {formFields.map(field => (
                      <Button
                        key={field.id}
                        onClick={() => insertVariable(index, field.id)}
                        variant="outline"
                        size="sm"
                      >
                        {`{${field.id}}`}
                      </Button>
                    ))}
                    {index > 0 && Array.from({ length: index }, (_, i) => (
                      <Button
                        key={`step_${i + 1}`}
                        onClick={() => insertVariable(index, `step_${i + 1}_output`)}
                        variant="outline"
                        size="sm"
                      >
                        {`{step_${i + 1}_output}`}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving || steps.length === 0}>
          {isSaving ? 'Saving...' : 'Save Pipeline'}
        </Button>
      </div>
    </div>
  );
}