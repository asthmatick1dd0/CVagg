export interface Resume {
  ID: number; 
  title: string;
  createdAt: string;
  updatedAt: string;
  user_id: number;
  id?: string;
  isSelected?: boolean;
  templateId?: string;
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