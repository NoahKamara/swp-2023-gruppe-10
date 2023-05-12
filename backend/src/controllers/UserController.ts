
import { User, IDUser } from '../models/user';
import { Session } from '../models/session';
/**
* Interface for Users
*
* @interface
*/
export interface UserController {
    /** 
    * creates a user in the database and returns it
    * @param {User} user without an id
    * @return {IDUser} a new user with the data from the function parameters
    */
    createUser(user: User): IDUser

    /** 
    * returns the user for the email, if no user exists, return nothing
    */
    getUserByEmail(email: string): IDUser

    /** 
    * returns the user for the id, if no user exists, return nothing
    */
    getUserById(id: number): IDUser

    /** 
    * creates a new session for a user
    */
    createSession(user: IDUser): Session

    /** 
    * returns a session from the session id, 
    * @return Session if it exists
    * @return nothing if there exists no session with this id
    */
    getSession(sessionId: string): Session

    /** 
    * deletes the session 
    */
    delSession(sessionId: string): void
}