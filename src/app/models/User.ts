import { Team } from './Team';

export interface User {
  request_status: string;
  id: number;
  username: string;
  is_friend: boolean;
  teams_in_common: Team[];
  request_sender: string;
}
