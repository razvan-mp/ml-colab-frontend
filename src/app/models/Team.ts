import { User } from './User';

export interface Team {
  admin: string;
  description?: string;
  id: number;
  name: string;
  users?: User[];
}
