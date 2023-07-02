/**
* Interface for Session Information
*
* @interface
* @extends {ParentInterfaceNameHereIfAny}
*/
import { User } from 'softwareproject-common';

export interface Session {
  /** used to identify the session & to authorize user  */
  sessionId: string

  /** id of the user this session belongs to */
  user: User
}
