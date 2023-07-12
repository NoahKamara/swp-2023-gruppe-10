import { User } from './user';
import { Event, EventListItem } from './event';

export interface Ticket {
  id: number
  amount: number
  user: User
  event: Event
}

export interface PublicTicket {
  id: number,
  amount: number,
  event: EventListItem
}
