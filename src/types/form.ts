export type FieldType = 
  | 'text'
  | 'dropdown'
  | 'radio'
  | 'file'
  | 'checkbox'
  | 'country'
  | 'date'
  | 'phone'
  | 'section';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  options?: string[];
  value: any;
  condition?: {
    fieldId: string;
    operator: '==' | '!=' | '>' | '<';
    value: any;
  };
  validation?: {
    pattern?: string;
    message?: string;
  };
  fields?: FormField[];
}

export interface FormSection {
  id: string;
  type: 'section';
  label: string;
  fields: FormField[];
}