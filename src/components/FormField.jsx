import React from 'react';
import { Phone, Globe, Calendar, FileText, Check, List } from 'lucide-react';
import { Input } from './ui/input';

const FormField = ({ field, register, errors, watch, setValue }) => {
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

  const renderField = () => {
    const registerOptions = {
      required: field.required ? `${field.label} is required` : false,
    };

    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            {...register(field.id, registerOptions)}
            className={`${errors[field.id] ? 'border-red-500' : ''} w-full`}
          />
        );
      
      case 'dropdown':
        return (
          <select
            {...register(field.id, registerOptions)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[field.id] ? 'border-red-500' : 'border-gray-300'
            }`}
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
                  value={option}
                  {...register(field.id, registerOptions)}
                  className="form-radio text-blue-600"
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
              {...register(field.id)}
              className="form-checkbox text-blue-600 rounded"
            />
            <span>{field.label}</span>
          </label>
        );

      case 'file':
        return (
          <Input
            type="file"
            {...register(field.id, registerOptions)}
            className={`${errors[field.id] ? 'border-red-500' : ''} w-full`}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            {...register(field.id, registerOptions)}
            className={`${errors[field.id] ? 'border-red-500' : ''} w-full`}
          />
        );

      case 'phone':
        return (
          <Input
            type="tel"
            {...register(field.id, {
              ...registerOptions,
              pattern: {
                value: /^\+?[1-9]\d{1,14}$/,
                message: 'Invalid phone number format'
              }
            })}
            className={`${errors[field.id] ? 'border-red-500' : ''} w-full`}
          />
        );

      case 'country':
        return (
          <select
            {...register(field.id, registerOptions)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[field.id] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select country...</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="PK">Pakistan</option>
          </select>
        );

      default:
        return null;
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
      {errors[field.id] && (
        <p className="text-sm text-red-500">{errors[field.id].message}</p>
      )}
    </div>
  );
};

export default FormField;