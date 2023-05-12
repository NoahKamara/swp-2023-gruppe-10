
import { User, IDUser } from '../models/user';

/**
* Interface for Users
*
* @interface
*/
export interface UserController {
    /** 
    * creates a user in the database and returns it
    * @param {User} a user without an id
    * @return {IDUser} a new user with the data from the function parameters
    */
    createUser(user: User): IDUser


    /** 
    * creates a new session for a user, _if_ they exist in the database
    */
    createSession(user: IDUser): string
}