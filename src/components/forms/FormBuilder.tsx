'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FieldEditor } from './FieldEditor'
import { FormField } from '../../types/form';
import { nanoid } from 'nanoid';
import { GripVertical, Edit, Trash2, Plus } from 'lucide-react';

interface FormBuilderProps {
  initialData?: {
    name: string;
    description: string;
    fields: FormField[];
  };
  onSave: (data: any) => Promise<void>;
}

const fieldTypes = [
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'textarea', label: 'Textarea', icon: '📄' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'select', label: 'Select', icon: '📋' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'radio', label: 'Radio', icon: '🔘' },
];

export function FormBuilder({ initialData, onSave }: FormBuilderProps) {
  const [formName, setFormName] = useState(initialData?.name || '');
  const [formDescription, setFormDescription] = useState(initialData?.description || '');
  const [fields, setFields] = useState<FormField[]>(initialData?.fields || []);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: nanoid(8),
      type,
      label: `New ${type} field`,
      placeholder: '',
      required: false,
      order: fields.length,
    };
    setFields([...fields, newField]);
    setEditingField(newField);
  };

  const updateField = (updatedField: FormField) => {
    setFields(fields.map(f => f.id === updatedField.id ? updatedField : f));
    setEditingField(null);
  };

  const deleteField = (id: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      setFields(fields.filter(f => f.id !== id).map((f, idx) => ({ ...f, order: idx })));
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newFields = [...fields];
    const draggedField = newFields[draggedIndex];
    newFields.splice(draggedIndex, 1);
    newFields.splice(index, 0, draggedField);
    
    setFields(newFields.map((f, idx) => ({ ...f, order: idx })));
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      alert('Please enter a form name');
      return;
    }

    if (fields.length === 0) {
      alert('Please add at least one field');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        name: formName,
        description: formDescription,
        fields: fields.map((f, idx) => ({ ...f, order: idx })),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Form Settings</h2>
        <div className="space-y-4">
          <Input
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter form name"
            required
          />
          <Textarea
            label="Description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Enter form description (optional)"
            rows={3}
          />
        </div>
      </div>

      {/* Field Types */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Fields</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {fieldTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => addField(type.value as FormField['type'])}
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="text-2xl mb-2">{type.icon}</span>
              <span className="text-xs font-medium text-gray-700">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Form Fields</h2>
        
        {fields.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Plus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="mb-4">No fields added yet</p>
            <p className="text-sm">Click the buttons above to add form fields</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`border border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="cursor-move text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{field.label}</span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                        {field.type}
                      </span>
                      {field.required && (
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    {field.placeholder && (
                      <p className="text-sm text-gray-500 mt-1">
                        Placeholder: {field.placeholder}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingField(field)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteField(field.id)}
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
        <Button onClick={handleSave} disabled={isSaving || !formName || fields.length === 0}>
          {isSaving ? 'Saving...' : 'Save Form'}
        </Button>
      </div>

      {/* Field Editor Modal */}
      {editingField && (
        <FieldEditor
          field={editingField}
          onSave={updateField}
          onCancel={() => setEditingField(null)}
        />
      )}
    </div>
  );
}
