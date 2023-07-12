import { Session } from '../session';
import { SessionInterface } from './session.interface';

/**
* An Interface for creating session instances
*
* @interface
*/
export interface SessionFactory<T extends SessionInterface> {
  /**
  * Creates a New Session
  *
  * @param {Session} session -- session data
  * @return {Promise<T>}
  */
  insert: (data: Session) => Promise<T>

  /**
  * tries to find a session by their id
  * > will throw when no there is no session by that id
  *
  * @param {string} sessionID - Session's sessionID
  * @return {Promise<T>}
  */
  byID: (sessionID: string) => Promise<T>

  /**
  * tries to delete a session
  *
  * @param {T} session - Session
  * @return {Promise<T>}
  */
  destroy(session: T): Promise<void>
}
