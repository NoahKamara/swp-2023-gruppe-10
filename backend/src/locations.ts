import { Request, Response } from 'express';
import { DBLocation } from './models/db.location';
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
   * returns details for an event (id specified at /events/:id)
   */
  async lookup(request: Request, response: Response): Promise<void> {
    const name = request.params.name.toLowerCase();

    if (!name) {
      console.error('client not provide name');
      response.status(404);
      response.send();
    }

    const location = await DBLocation.findOne({
      where: {
        name: {
          [Op.iLike]: name
        }
      }
    });

    if (!location) {
      console.error('did not find location for id');

      response.status(404);
      response.send({ code: 404, message: 'Keine Attraktion mit diesem Namen' });
      return;
    }


    response.status(200);
    response.send(location);
    return;
  }
}
