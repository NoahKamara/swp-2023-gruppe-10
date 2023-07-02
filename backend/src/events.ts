import { DBEvent } from './models/db.event';
import { Request, Response } from 'express';
import { APIResponse } from './models/response';


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

    try {
      if (searchTerm) {
        request.logger.info(`listing events matching: "${searchTerm}"`);

        events = await DBEvent.search(String(searchTerm));
      } else {
        request.logger.info('listing all events');
        events = await DBEvent.upcoming();
      }

      APIResponse.success(events).send(response);
    } catch (err) {
      APIResponse.internal(err).send(response);
    }
  }

  /**
   * returns details for an event (id specified at /events/:id)
   */
  async details(request: Request, response: Response): Promise<void> {
    const id = request.params.id;


    if (!id) {
      request.logger.error('client not provide id');
      APIResponse.badRequest('missing :id in path').send(response);
      return;
    }

    const event = await DBEvent.findByPk(id);

    if (!event) {
      request.logger.error('did not find event for id');
      APIResponse.notFound('missing :id in path').send(response);
      return;
    }

    APIResponse.success(event).send(response);
    return;
  }
}
