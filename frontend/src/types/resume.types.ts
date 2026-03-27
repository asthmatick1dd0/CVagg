export interface EducationItem {
  field_id?: number;
  university: string;
  faculty: string;
  degree: string;
  major: string;
  start_date: string;
  end_date?: string | null;
  finished: boolean;
}

export interface ExperienceItem {
  field_id: number;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
}

export interface SkillItem {
  field_id?: number;
  SkillId: number; 
  SkillName?: string; 
}

export interface CustomFieldItem {
  field_id?: number;
  title: string;
  content: string;
}

export interface Resume {
  id?: number | string; 
  ID?: number;          
  user_id?: number;
  title?: string;
  
  createdAt?: string;
  updatedAt?: string;

  personalInfo: {
    field_id: number;
    name?: string;
    surname?: string;
    jobTitle?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    birthDate?: string;
    website?: string;
    github?: string;
  };

  education?: EducationItem[];
  experience?: ExperienceItem[];
  skills?: SkillItem[];
  custom?: CustomFieldItem[];
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