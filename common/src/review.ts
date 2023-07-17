import { User } from './user';

export interface Review {
  user: User;
  location: Location
  stars: number
  helpful: number
  title: string
  comment: string
}

/**
* Info required to create a review
*
* @interface
* @schema
*/
export interface CreateReview {
  /**
   * @min 1
   * @max 5
   */
  stars: number;
  title: string;
  comment?: string;
}

export interface PublicReview {
  id: number;
  name: string;
  stars: number;
  title: string;
  comment?: string;
  helpful: number;
}
