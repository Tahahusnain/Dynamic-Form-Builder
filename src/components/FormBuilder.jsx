import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from './ui/button';
import { Input } from './ui/input';
import FormField from './FormField';

const FormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState({
    type: 'text',
    label: '',
    required: false,
  });

  const fieldTypes = [
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

  // Generate validation schema based on fields
  const generateValidationSchema = () => {
    const schemaFields = {};
    fields.forEach(field => {
      let validator;
      
      switch (field.type) {
        case 'text':
          validator = yup.string();
          break;
        case 'email':
          validator = yup.string().email('Invalid email format');
          break;
        case 'phone':
          validator = yup.string().matches(
            /^\+?[1-9]\d{1,14}$/,
            'Invalid phone number'
          );
          break;
        case 'date':
          validator = yup.date().typeError('Please enter a valid date');
          break;
        case 'checkbox':
          validator = yup.boolean();
          break;
        case 'dropdown':
        case 'radio':
          validator = yup.string().oneOf(
            field.options || [],
            'Please select a valid option'
          );
          break;
        case 'country':
          validator = yup.string().oneOf(
            ['US', 'UK', 'CA', 'AU'],
            'Please select a valid country'
          );
          break;
        default:
          validator = yup.string();
      }

      if (field.required) {
        validator = validator.required(`${field.label} is required`);
      }

      schemaFields[field.id] = validator;
    });

    return yup.object().shape(schemaFields);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(generateValidationSchema()),
    mode: 'onChange'
  });

  const addField = () => {
    if (newField.label) {
      const fieldId = `field-${Date.now()}`;
      setFields(prevFields => [...prevFields, {
        id: fieldId,
        type: newField.type,
        label: newField.label,
        required: newField.required,
        options: newField.type === 'dropdown' || newField.type === 'radio' 
          ? ['Option 1', 'Option 2']
          : undefined,
      }]);
      setNewField({ type: 'text', label: '', required: false });
      setShowAddField(false);
    }
  };

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    alert('Form submitted successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dynamic Form Builder</h1>
        <Button onClick={() => setShowAddField(true)} className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Field</span>
        </Button>
      </div>

      {showAddField && (
        <div className="p-4 border rounded-md space-y-4 bg-gray-50">
          <h2 className="text-lg font-semibold">Add New Field</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Field Type</label>
              <select
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              <Input
                type="text"
                value={newField.label}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
              />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Required</span>
              </label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={addField}>Add</Button>
              <Button
                onClick={() => setShowAddField(false)}
                variant="secondary"
                className="bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        ))}

        {fields.length > 0 && (
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          >
            Submit Form
          </Button>
        )}
      </form>
    </div>
  );
};

export default FormBuilder;