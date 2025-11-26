'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { FormField } from '../../types/form';
import { Plus, X } from 'lucide-react';

interface FieldEditorProps {
  field: FormField;
  onSave: (field: FormField) => void;
  onCancel: () => void;
}

export function FieldEditor({ field, onSave, onCancel }: FieldEditorProps) {
  const [editedField, setEditedField] = useState<FormField>({ ...field });
  const [newOption, setNewOption] = useState('');

  const handleSave = () => {
    if (!editedField.label.trim()) {
      alert('Field label is required');
      return;
    }
    onSave(editedField);
  };

  const addOption = () => {
    if (!newOption.trim()) return;
    setEditedField({
      ...editedField,
      options: [...(editedField.options || []), newOption.trim()],
    });
    setNewOption('');
  };

  const removeOption = (index: number) => {
    setEditedField({
      ...editedField,
      options: editedField.options?.filter((_, i: number) => i !== index),
    });
  };

  const needsOptions = ['select', 'checkbox', 'radio'].includes(editedField.type);

  return (
    <Modal isOpen={true} onClose={onCancel} title="Edit Field" size="lg">
      <div className="space-y-4">
        <Input
          label="Field Label"
          value={editedField.label}
          onChange={(e) => setEditedField({ ...editedField, label: e.target.value })}
          placeholder="Enter field label"
          required
        />

        <Input
          label="Field ID"
          value={editedField.id}
          onChange={(e) => setEditedField({ ...editedField, id: e.target.value })}
          placeholder="field_id"
          helperText="Unique identifier used in AI prompts (e.g., {field_id})"
        />

        <Input
          label="Placeholder"
          value={editedField.placeholder || ''}
          onChange={(e) => setEditedField({ ...editedField, placeholder: e.target.value })}
          placeholder="Enter placeholder text"
        />

        <Textarea
          label="Help Text"
          value={editedField.helpText || ''}
          onChange={(e) => setEditedField({ ...editedField, helpText: e.target.value })}
          placeholder="Additional help text for users"
          rows={2}
        />

        <Checkbox
          label="Required field"
          checked={editedField.required}
          onChange={(e) => setEditedField({ ...editedField, required: e.target.checked })}
        />

        {/* Validation */}
        {(editedField.type === 'text' || editedField.type === 'textarea') && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Validation</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Length"
                type="number"
                value={editedField.validation?.min || ''}
                onChange={(e) => setEditedField({
                  ...editedField,
                  validation: { ...editedField.validation, min: parseInt(e.target.value) || undefined }
                })}
              />
              <Input
                label="Max Length"
                type="number"
                value={editedField.validation?.max || ''}
                onChange={(e) => setEditedField({
                  ...editedField,
                  validation: { ...editedField.validation, max: parseInt(e.target.value) || undefined }
                })}
              />
            </div>
          </div>
        )}

        {/* Options for select, checkbox, radio */}
        {needsOptions && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Options</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Add option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
              />
              <Button onClick={addOption} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {editedField.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{option}</span>
                  <button
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Field
          </Button>
        </div>
      </div>
    </Modal>
  );
}