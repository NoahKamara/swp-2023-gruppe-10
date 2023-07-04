import { User } from 'softwareproject-common';

export interface Session {
  session_id: string
  user: User
}
