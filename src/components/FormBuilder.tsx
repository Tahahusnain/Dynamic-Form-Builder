import React, { useState } from 'react';
import { FormField as IFormField, FieldType } from '../types/form';
import FormField from './FormField';
import { useForm } from '../context/FormContext';
import { Plus } from 'lucide-react';

const FormBuilder: React.FC = () => {
  const { state, dispatch } = useForm();
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState<Partial<IFormField>>({
    type: 'text',
    label: '',
    required: false,
  });

  const fieldTypes: FieldType[] = [
    'text',
    'dropdown',
    'radio',
    'file',
    'checkbox',
    'country',
    'date',
    'phone',
    'section',
  ];

  const addField = () => {
    if (newField.label) {
      dispatch({
        type: 'ADD_FIELD',
        field: {
          id: `field-${Date.now()}`,
          type: newField.type as FieldType,
          label: newField.label,
          required: newField.required,
          value: '',
          options: newField.type === 'dropdown' || newField.type === 'radio' 
            ? ['Option 1', 'Option 2']
            : undefined,
        },
      });
      setNewField({ type: 'text', label: '', required: false });
      setShowAddField(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dynamic Form Builder</h1>
        <button
          onClick={() => setShowAddField(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
          <span>Add Field</span>
        </button>
      </div>

      {showAddField && (
        <div className="p-4 border rounded-md space-y-4 bg-gray-50">
          <h2 className="text-lg font-semibold">Add New Field</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Field Type</label>
              <select
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {fieldTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Label</label>
              <input
                type="text"
                value={newField.label}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Required</span>
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addField}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddField(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-6">
        {state.fields.map((field) => (
          <FormField key={field.id} field={field} />
        ))}
      </form>

      {state.fields.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-semibold mb-4">Form Data</h2>
          <pre className="whitespace-pre-wrap bg-white p-4 rounded-md border">
            {JSON.stringify(state.values, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;