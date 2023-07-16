import { DBReview } from './models/db.review';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { User } from 'softwareproject-common';
import { DBLocation } from './models/db.location';
import { APIResponse } from './models/response';
import { DBUser } from './models/user/user';
import { validateBody } from './validation/requestValidation';
import { createReviewSchema } from './validation/review';


export class ReviewController {

  /**
 * returns details for a review by name of location
 */
  async lookup(request: Request, response: Response): Promise<void> {
    const name = request.params.name.toLowerCase();
    const userID = response.locals.session.user.id;
    if (!userID) {
      console.error('unauthorized');
      APIResponse.unauthorized().send(response);
      return;
    }

    if (!name) {
      console.error('client not provide name');
      APIResponse.badRequest('client did not provide name').send(response);
      return;
    }

    try {
      const location = await DBLocation.findOne({
        where: {
          name: {
            [Op.iLike]: name
          }
        },
        include: { all: true, nested: true }
      });

      if (!location) {
        console.error(`No location with name ${name}`);
        APIResponse.notFound(`No location with name ${name}`).send(response);
        return;
      }

      // Convert to public and remove signed-in user's review
      const reviews = location.reviews.flatMap(r => {
        if (r.user_id === userID) return null;
        return r.public;
      }).filter(r => r);

      APIResponse.success(reviews).send(response);
    } catch (err) {
      request.logger.error(err);
      APIResponse.internal(err).send(response);
    }
  }





   /**
 * returns review by the signed in user for a location
 */
   async mine(request: Request, response: Response): Promise<void> {
    const user = response.locals.session.user;
    if (!user) {
      APIResponse.unauthorized().send(response);
      return;
    }

    const name = request.params.name.toLowerCase();

    if (!name) {
      console.error('client not provide name');
      APIResponse.badRequest('client did not provide name').send(response);
      return;
    }

    try {
      const location = await DBLocation.lookup(name);

      if (!location) {
        console.error(`No location with name ${name}`);
        APIResponse.notFound(`No location with name ${name}`).send(response);
        return;
      }

      const review = await DBReview.findOne({
        where: {
          location_id: location.id,
          user_id: user.id
        },
        include: { all: true, nested: true }
      });

      if (!review) {
        console.error(`user has not reviewed location ${location.id}`);
        APIResponse.notFound(`user has not reviewed ${name}`).send(response);
        return;
      }

      APIResponse.success(review.public).send(response);
    } catch (err) {
      request.logger.error(err);
      APIResponse.internal(err).send(response);
    }
  }

  async postReview(request: Request, response: Response): Promise<void> {
    try {
      const user: User = response.locals.session.user;


      if (!user || !user.id) {
        console.log(user.id);
        APIResponse.unauthorized().send(response);
        return;
      }

      const name = request.params.name;

      if (!name) {
        request.logger.error('client did not provide event name');
        APIResponse.badRequest('client did not provide event id').send(response);
        return;
      }

      const location = await DBLocation.lookup(name);

      if (!location) {
        request.logger.error(`location name '${name}' was invalid`);
        APIResponse.badRequest(`location name '${name}' was invalid`).send(response);
        return;
      }



      const data = validateBody(request, response, createReviewSchema);

      request.logger.info(data);

      await DBReview.upsert(
        {
          ...data,
          user_id: user.id,
          location_id: location.id,
          location_name: location.name,
        }
      );

      const review = await DBReview.findOne({
        where: {
          user_id: user.id,
          location_id: location.id
        },
        include:[DBUser]
      });

      if (!review) {
        APIResponse.notFound('did not find created review').send(response);
        return;
      }
      console.log(review);
      APIResponse.success(review.public).send(response);
    } catch (err) {
      request.logger.error(err);
      response.send({ code: 500, message: err });
    }
  }
  /**
   * returns rating for a location by name
   */
   async lookup2(request: Request, response: Response): Promise<void> {
    const id = request.params.id;
    console.log(id);
    if (!id) {
      console.error('client not provide if');
      APIResponse.badRequest('Missing if').send(response);
    }

    try {
      const helpful = await DBReview.lookup2(Number(id));


      if (!helpful) {
        console.error('did not find location for id');
        APIResponse.notFound(`No review with name ${id}`).send(response);
        return;
      }

      APIResponse.success(helpful).send(response);
    } catch (err) {
      APIResponse.internal(err).send(response);
    }
    return;
  }

  
}

