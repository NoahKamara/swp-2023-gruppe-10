import { DBEvent } from './models/db.event';
import { Request, Response } from 'express';
import { FindAttributeOptions, Op, Order } from 'sequelize';


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

    const attribs: FindAttributeOptions = ['id', 'title', 'start_date', 'end_date', 'price'];
    const order: Order = [
      ['start_date', 'ASC'],
      ['end_date', 'DESC']
    ];

    try {
      if (searchTerm) {
        console.info(`listing events matching: "${searchTerm}"`);

        // Filter title or description like search term
        events = await DBEvent.findAll({
          attributes: attribs,
          where: {
            start_date: {
              [Op.gte]: Date.now()
            },
            [Op.or]: {
              title: {
                [Op.iLike]: '%' + searchTerm + '%'
              },
              description: {
                [Op.iLike]: '%' + searchTerm + '%'
              }
            }
          },
          order: order
        });
      } else {
        console.info('listing all events');

        // dont filter
        events = await DBEvent.findAll({
          attributes: attribs,
          where: {
            start_date: {
              [Op.gte]: Date.now()
            }
          },
          order: order
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
      console.error('client not provide id');
      response.status(404);
      response.send();
    }

    const event = await DBEvent.findByPk(id);

    if (!event) {
      console.error('did not find event for id');

      response.status(404);
      response.send({ code: 404, message: 'Kein Event zu dieser ID' });
      return;
    }


    response.status(200);
    response.send(event);
    return;
  }
}
