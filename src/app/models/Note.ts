import { User } from './User';
import { Team } from './Team';

export interface Note {
  id?: number;
  title?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
  graph_data?: any;
  page?: string;
  user?: string;
  team?: Team;
}
