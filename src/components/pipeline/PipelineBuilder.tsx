'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { StepEditor } from './StepEditor';
import { PipelineStep } from '@/types/pipeline';
import { Plus, GripVertical, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface PipelineBuilderProps {
  formFields: Array<{ id: string; label: string; type: string }>;
  initialSteps?: PipelineStep[];
  onSave: (steps: PipelineStep[]) => Promise<void>;
}

export function PipelineBuilder({ formFields, initialSteps, onSave }: PipelineBuilderProps) {
  const [steps, setSteps] = useState<PipelineStep[]>(initialSteps || []);
  const [editingStep, setEditingStep] = useState<{ step: PipelineStep; index: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addStep = () => {
    const newStep: PipelineStep = {
      stepNumber: steps.length + 1,
      name: `Step ${steps.length + 1}`,
      prompt: '',
      description: '',
      model: 'gemini-1.5-pro',
    };
    setSteps([...steps, newStep]);
    setEditingStep({ step: newStep, index: steps.length });
  };

  const updateStep = (index: number, updatedStep: PipelineStep) => {
    const newSteps = [...steps];
    newSteps[index] = updatedStep;
    setSteps(newSteps);
    setEditingStep(null);
  };

  const deleteStep = (index: number) => {
    if (confirm('Are you sure you want to delete this step?')) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(renumberSteps(newSteps));
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) {
      return;
    }

    const newSteps = [...steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setSteps(renumberSteps(newSteps));
  };

  const renumberSteps = (stepsArray: PipelineStep[]) => {
    return stepsArray.map((step, idx) => ({ ...step, stepNumber: idx + 1 }));
  };

  const handleSave = async () => {
    if (steps.length === 0) {
      alert('Please add at least one pipeline step');
      return;
    }

    const incompleteStep = steps.find(step => !step.prompt.trim());
    if (incompleteStep) {
      alert(`Step ${incompleteStep.stepNumber} is missing a prompt`);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(steps);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 How Pipelines Work</h3>
        <p className="text-sm text-blue-800">
          Each step processes the form submission sequentially. You can use variables like <code className="bg-blue-100 px-1 rounded">{'{field_id}'}</code> for form fields 
          and <code className="bg-blue-100 px-1 rounded">{'{step_1_output}'}</code> for previous step results.
        </p>
      </div>

      {/* Available Variables */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Variables</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          <div className="bg-gray-50 rounded px-3 py-2">
            <code className="text-sm text-blue-600">{'{all_fields}'}</code>
          </div>
          {formFields.map(field => (
            <div key={field.id} className="bg-gray-50 rounded px-3 py-2">
              <code className="text-sm text-blue-600">{`{${field.id}}`}</code>
              <span className="text-xs text-gray-500 ml-1">({field.label})</span>
            </div>
          ))}
          {steps.map((_, idx) => (
            <div key={idx} className="bg-gray-50 rounded px-3 py-2">
              <code className="text-sm text-purple-600">{`{step_${idx + 1}_output}`}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Pipeline Steps</h2>
          <Button onClick={addStep}>
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>

        {steps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Plus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="mb-4">No pipeline steps configured yet</p>
            <p className="text-sm">Click "Add Step" to create your first AI processing step</p>
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveStep(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => moveStep(index, 'down')}
                      disabled={index === steps.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-blue-600">
                        Step {step.stepNumber}
                      </span>
                      <span className="font-semibold text-gray-900">{step.name}</span>
                      {step.model && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                          {step.model}
                        </span>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    )}
                    <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-700">
                      {step.prompt ? (
                        <p className="line-clamp-3">{step.prompt}</p>
                      ) : (
                        <p className="text-gray-400 italic">No prompt configured</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingStep({ step, index })}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteStep(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving || steps.length === 0}>
          {isSaving ? 'Saving...' : 'Save Pipeline'}
        </Button>
      </div>

      {/* Step Editor Modal */}
      {editingStep && (
        <StepEditor
          step={editingStep.step}
          stepIndex={editingStep.index}
          formFields={formFields}
          previousSteps={steps.slice(0, editingStep.index)}
          onSave={(updatedStep) => updateStep(editingStep.index, updatedStep)}
          onCancel={() => setEditingStep(null)}
        />
      )}
    </div>
  );
}