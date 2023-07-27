import { PublicEvent } from './event.db';
import { EventInterface } from './event.interface';
import { EventFilter } from 'softwareproject-common';

/**
* An Interface for creating session instances
*
* @interface
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface EventFactory<T extends EventInterface> {
  /**
    * returns upcoming events that match the filter
    */
  filterUpcoming: (filter: EventFilter, user_id: number) => Promise<PublicEvent[]>
}
