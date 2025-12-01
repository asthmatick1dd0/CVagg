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
