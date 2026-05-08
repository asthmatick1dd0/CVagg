export interface Account {
  id: string | number;
  username: string;
  name: string;
  surname: string;
  email: string;
  resumeCount: number;
  avatar?: string;
}