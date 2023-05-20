
/**
* Info required to login a user
*
* @interface
* @schema
*/
export declare interface UserCredentials {
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
* User Address
*
* @interface
* @schema
*/
export declare interface UserAddress {
  street: string
  number: string
  city: string
  zipcode: string
}

/**
* User Names
*
* @interface
* @schema
*/
export declare interface UserName {
  firstName: string
  lastName: string
}

/**
* Model for creating a new user
*
* @interface
* @schema
*/
export declare interface CreateUser extends UserCredentials, UserAddress, UserName {}

/**
* Model for creating a user's password
*
* @interface
* @schema
*/
export declare interface UpdatePassword {
  oldPassword: string
  newPassword: string
}

/**
* A user from the database
*
* @interface
*/
export declare interface User extends UserCredentials, UserAddress, UserName {
  id: number
}

/**
* A public user that can be return by the API (without password)
*
* @interface
*/
export declare interface PublicUser extends UserAddress, UserName {
  id: number
  email: string
}
