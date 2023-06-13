import { DBEvent } from './models/db.event';
import { Request, Response } from 'express';
import { FindAttributeOptions, Op } from 'sequelize';


export class EventController {
  /**
  * Returns a list of _upcoming_ events
  *
  * Can be filtered using the 'term' query paramter
  * - all:    GET /events
  * - search: GET /events?term='blumen'
  */
  async list(request: Request, response: Response): Promise<void> {
    const searchTerm = request.query.term;

    let events: DBEvent[];

    const attribs: FindAttributeOptions = ['id', 'title', 'start_date', 'end_date', 'price', 'picture'];

    try {
      if (searchTerm) {
        request.logger.info(`listing events matching: "${searchTerm}"`);

        // Filter title or description like search term
        events = await DBEvent.findAll({
          attributes: attribs,
          where: {
            start_date: {
              [Op.gte]: Date.now()
            },
            title: {
              [Op.iLike]: '%' + searchTerm + '%'
            },
          }
        });
      } else {
        request.logger.info('listing all events');

        // dont filter
        events = await DBEvent.findAll({
          attributes: attribs,
          where: {
            start_date: {
              [Op.gte]: Date.now()
            }
          },
          order: [
            ['start_date', 'ASC'],
            ['end_date', 'DESC']
          ]
        });
      }

      response.status(200);
      response.send(events);
    } catch (err) {
      response.status(500);
      response.send(err);
    }
  }

  /**
   * returns details for an event (id specified at /events/:id)
   */
  async details(request: Request, response: Response): Promise<void> {
    const id = request.params.id;

    if (!id) {
      request.logger.error('client not provide id');
      response.status(404);
      response.send();
    }

    const event = await DBEvent.findByPk(id);

    if (!event) {
      request.logger.error('did not find event for id');

      response.status(404);
      response.send({ code: 404, message: 'Kein Event zu dieser ID' });
      return;
    }


    response.status(200);
    response.send(event);
    return;
  }
}
