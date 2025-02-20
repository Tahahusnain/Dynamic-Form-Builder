import React, { createContext, useContext, useReducer } from 'react';
import { FormField } from '../types/form';

interface FormState {
  fields: FormField[];
  values: Record<string, any>;
  errors: Record<string, string>;
}

type FormAction = 
  | { type: 'ADD_FIELD'; field: FormField }
  | { type: 'UPDATE_VALUE'; id: string; value: any }
  | { type: 'SET_ERROR'; id: string; error: string }
  | { type: 'REMOVE_FIELD'; id: string };

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | undefined>(undefined);

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'ADD_FIELD':
      return {
        ...state,
        fields: [...state.fields, action.field],
      };
    case 'UPDATE_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.id]: action.value,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.id]: action.error,
        },
      };
    case 'REMOVE_FIELD':
      return {
        ...state,
        fields: state.fields.filter(field => field.id !== action.id),
        values: Object.fromEntries(
          Object.entries(state.values).filter(([key]) => key !== action.id)
        ),
        errors: Object.fromEntries(
          Object.entries(state.errors).filter(([key]) => key !== action.id)
        ),
      };
    default:
      return state;
  }
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, {
    fields: [],
    values: {},
    errors: {},
  });

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};