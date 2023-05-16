
import { UserInfo, User } from '../models/user';
import { Session } from '../models/session';
/**
* User Adapter between API Layer & Database Layer
* @interface
*/
export interface UserAdapter {
    /** 
    * creates a new user in the database and returns it
    * @param {UserInfo} info required information to create a user
    * @return {User} a new user with the data from the function parameters
    */
    createUser(info: UserInfo): User

    /** 
    * @param {string} email of the user
    * @return {User} the user for the email, if no user exists, return nothing
    */
    getUserByEmail(email: string): User

    /** 
    * returns the user for the id, if no user exists, return nothing
    * @param {number} id of the user
    * @return {User} the user for the id, if no user exists, return nothing
    */
    getUserById(id: number): User

    /** 
    * creates a new session for a user
    * @param {User} user
    * @return {Session} a new session
    */
    createSession(user: User): Session

    /** 
    * returns a session from the session id, 
    * @return {Session} session if it exists
    * @return {undefined} nothing if there exists no session with this id
    */
    getSession(sessionId: string): Session

    /** 
    * deletes the session 
    * @param {string} sessionId
    */
    delSession(sessionId: string): void
}