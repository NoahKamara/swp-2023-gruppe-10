import { PublicEvent } from './event.db';
import { EventInterface } from './event.interface';




export type EventFilter = {
  term?: string
}

/**
* An Interface for creating session instances
*
* @interface
*/
export interface EventFactory<T extends EventInterface> {
  /**
    * returns upcoming events that match the filter
    */
  filterUpcoming: (filter: EventFilter, user_id: number) => Promise<PublicEvent[]>
}
