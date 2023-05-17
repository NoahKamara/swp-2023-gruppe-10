/**
* Info required to login a user
*
* @interface
* @schema
*/
export interface UserLoginInfo {
  /**
 * @format email
 */
  email: string

  /**
   * @minLength 8
   */
  password: string
}

/**
* Info required to create, or update a user
*
* @interface
* @extends {UserInfo}
* @schema
*/
export interface UserInfo extends UserLoginInfo {
  firstName: string
  lastName: string
}

/**
* A user from the database
*
* @interface
* @extends {UserInfo}
*/
export interface User extends UserInfo {
  id: number
}