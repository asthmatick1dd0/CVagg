export interface Resume {
  id: number;
  personalInfo: {
    name?: string;
    surname?: string;
    jobTitle?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  };
  experience?: string[];
  education?: string[];
  skills?: string[];
}


export type FieldType = 'text' | 'email' | 'textarea' | 'number' | 'select';
export type PredefinedFieldLabel = 'Дата рождения' | 'Веб-сайт' | 'GitHub' | 'Текстовое поле';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  value: string;
  placeholder?: string;
  options?: string[];
}