// frontend/src/components/forms/FormBuilder.tsx
'use client';

import { SetStateAction, useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FieldEditor } from './FieldEditor';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FormField } from '@/types/form';
import { nanoid } from 'nanoid';

interface FormBuilderProps {
  initialData?: {
    name: string;
    description: string;
    fields: FormField[];
  };
  onSave: (data: any) => Promise<void>;
}

export function FormBuilder({ initialData, onSave }: FormBuilderProps) {
  const [formName, setFormName] = useState(initialData?.name || '');
  const [formDescription, setFormDescription] = useState(initialData?.description || '');
  const [fields, setFields] = useState<FormField[]>(initialData?.fields || []);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: nanoid(),
      type,
      label: `New ${type} field`,
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
    setFields(fields.filter(f => f.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex).map((field, index) => ({
          ...field,
          order: index,
        }));
      });
    }
  };

  const handleSave = async () => {
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Form Settings</h2>
        <div className="space-y-4">
          <Input
            label="Form Name"
            value={formName}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setFormName(e.target.value)}
            placeholder="Enter form name"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Enter form description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Form Fields</h2>
        
        <div className="mb-4 flex flex-wrap gap-2">
          <Button onClick={() => addField('text')} variant="outline">+ Text</Button>
          <Button onClick={() => addField('email')} variant="outline">+ Email</Button>
          <Button onClick={() => addField('textarea')} variant="outline">+ Textarea</Button>
          <Button onClick={() => addField('number')} variant="outline">+ Number</Button>
          <Button onClick={() => addField('date')} variant="outline">+ Date</Button>
          <Button onClick={() => addField('select')} variant="outline">+ Select</Button>
          <Button onClick={() => addField('checkbox')} variant="outline">+ Checkbox</Button>
          <Button onClick={() => addField('radio')} variant="outline">+ Radio</Button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {fields.map(field => (
                <div
                  key={field.id}
                  className="border border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 cursor-move"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="font-medium">{field.label}</span>
                      <span className="ml-2 text-sm text-gray-500">({field.type})</span>
                      {field.required && (
                        <span className="ml-2 text-sm text-red-500">*Required</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingField(field)}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteField(field.id)}
                        variant="outline"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {fields.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No fields added yet. Click the buttons above to add form fields.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={handleSave} disabled={isSaving || !formName}>
          {isSaving ? 'Saving...' : 'Save Form'}
        </Button>
      </div>

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