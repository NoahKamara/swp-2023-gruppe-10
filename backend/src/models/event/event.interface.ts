import { Event, EventListItem } from 'softwareproject-common';


export interface EventInterface extends Event {
  listItem(): EventListItem
}
