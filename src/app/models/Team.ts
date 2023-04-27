import { User } from './User';
import { Note } from './Note';

export interface Team {
  admin: string;
  description?: string;
  id: number;
  name: string;
  users?: User[];
  notes?: Note[];
}
