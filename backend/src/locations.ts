import { Request, Response } from 'express';
import { DBLocation } from './models/db.location';
import { Sequelize } from 'sequelize-typescript';
import { DBReview } from './models/db.review';
import { Op } from 'sequelize';

export class LocationController {
  /**
  * Returns a list of locations
  */
  async list(request: Request, response: Response): Promise<void> {
    try {
      const locations = await DBLocation.findAll();
      response.status(200);
      response.send(locations);
    } catch (err) {
      response.status(500);
      response.send(err);
    }
  }

  /**
   * returns details for a location by name
   */
  async lookup(request: Request, response: Response): Promise<void> {
    const name = request.params.name.toLowerCase();

    if (!name) {
      console.error('client not provide name');
      response.status(404);
      response.send();
    }
try {
    const location = await DBLocation.findOne({
      subQuery : false,
      include: [
        {
          model: DBReview,
          as: 'reviews',
          attributes: [],
        },
      ],
      attributes: {
        include: [[Sequelize.fn('avg', Sequelize.col('reviews.stars')), 'average_rating']],
      },
      where: {
        name: {
          [Op.iLike]: name
        }
      },
      
      group:['locations.name']


    });

    if (!location) {
      console.error('did not find location for id');

      response.status(404);
      response.send({ code: 404, message: 'Keine Attraktion mit diesem Namen' });
      return;
    }


    response.status(200);
    response.send(location);
  } catch (err) {
    response.send(err);
    console.log(err);    
  }
    return;
  }
}
