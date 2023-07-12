import { UserInterface } from './user.interface';
import { CreateUser } from 'softwareproject-common';
/**
* An Interface for creating user instances
*
* @interface
*/
export interface UserFactory<T extends UserInterface> {
  /**
  * Creates a New User
  *
  * @param {data} CreateUser - User Creation Data
  * @return {Promise<T>}
  */
  insert: (data: CreateUser) => Promise<T>

  /**
  * tries to find a user by their id
  * > will throw when no there is no user by that id
  *
  * @param {number} id - User's ID
  * @return {Promise<T>}
  */
  byID: (id: number) => Promise<T>

  /**
  * tries to find a user by their email
  * > will throw when no there is no user with that email
  *
  * @param {string} email - User's email
  * @return {Promise<T>}
  */
  byEmail: (email: string) => Promise<T>
}


