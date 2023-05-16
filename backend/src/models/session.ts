/**
* Interface for Session Information
*
* @interface
* @extends {ParentInterfaceNameHereIfAny}
*/
export interface Session {
  /** used to identify the session & to authorize user  */
  sessionId: string

  /** id of the user this session belongs to */
  userId: number
}
