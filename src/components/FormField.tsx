import React from 'react';
import { FormField as IFormField } from '../types/form';
import { useForm } from '../context/FormContext';
import { Phone, Globe, Calendar, FileText, Check, List } from 'lucide-react';

const FormField: React.FC<{ field: IFormField }> = ({ field }) => {
  const { state, dispatch } = useForm();

  const handleChange = (value: any) => {
    dispatch({ type: 'UPDATE_VALUE', id: field.id, value });
    
    // Validate
    if (field.validation?.pattern) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        dispatch({
          type: 'SET_ERROR',
          id: field.id,
          error: field.validation.message || 'Invalid input',
        });
      } else {
        dispatch({ type: 'SET_ERROR', id: field.id, error: '' });
      }
    }
  };

  // Check if field should be shown based on conditions
  const shouldShow = () => {
    if (!field.condition) return true;
    const { fieldId, operator, value } = field.condition;
    const fieldValue = state.values[fieldId];
    
    switch (operator) {
      case '==': return fieldValue === value;
      case '!=': return fieldValue !== value;
      case '>': return fieldValue > value;
      case '<': return fieldValue < value;
      default: return true;
    }
  };

  if (!shouldShow()) return null;

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={state.values[field.id] || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      
      case 'dropdown':
        return (
          <select
            value={state.values[field.id] || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={state.values[field.id] === option}
                  onChange={() => handleChange(option)}
                  className="form-radio"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={state.values[field.id] || false}
              onChange={(e) => handleChange(e.target.checked)}
              className="form-checkbox"
            />
            <span>{field.label}</span>
          </label>
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => handleChange(e.target.files?.[0])}
            className="w-full"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={state.values[field.id] || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'phone':
        return (
          <input
            type="tel"
            value={state.values[field.id] || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'country':
        return (
          <select
            value={state.values[field.id] || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select country...</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
        );

      case 'section':
        return (
          <div className="space-y-4">
            {field.fields?.map((subField) => (
              <FormField key={subField.id} field={subField} />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (field.type) {
      case 'phone': return <Phone className="w-5 h-5" />;
      case 'country': return <Globe className="w-5 h-5" />;
      case 'date': return <Calendar className="w-5 h-5" />;
      case 'file': return <FileText className="w-5 h-5" />;
      case 'checkbox': return <Check className="w-5 h-5" />;
      default: return <List className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {getIcon()}
        <label className="font-medium">
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
        </label>
      </div>
      {renderField()}
      {state.errors[field.id] && (
        <p className="text-sm text-red-500">{state.errors[field.id]}</p>
      )}
    </div>
  );
};

export default FormField;