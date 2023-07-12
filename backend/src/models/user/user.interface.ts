import { PublicUser, Ticket, User } from 'softwareproject-common';
import { Session } from '../session';

/**
* An Interface for interacting with a instance of a user
*
* @interface
*/
export interface UserInterface extends User {
  /**
    * Updates a users name in the database
    *
    * @param {string} firstName
    * @param {string} lastName
    */
  updateName({ firstName, lastName }: { firstName: string; lastName: string; }): Promise<void>

  /**
  * Updates a users address in the database
  *
  * @param {string} street
  * @param {string} number
  * @param {string} city
  * @param {string} zipcode
  */
  updateAddress({ street, number, city, zipcode }: { street: string; number: string; city: string; zipcode: string; }): Promise<void>

  /**
  * Updates a users password in the database
  *
  * @memberof DBUser
  * @param {string} old
  * @param {string} new
  * @return {Promise<void>}
  */
  updatePassword(password: string): Promise<void>

  /**
  * Creates a new session for this user
  *
  * @return {Promise<Session>}
  */
  createSession(): Promise<Session>

  /**
  * Creates Tickets for an event for this user
  *
  * @param {number} event
  * @return {Promise<Ticket>}
  */
  addTicket({ event, amount }: { event: number; amount: number; }): Promise<Ticket>

  get public(): PublicUser
}

