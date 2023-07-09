import { DBEvent } from './models/event/event.db';
import { Request, Response } from 'express';
import { APIResponse } from './models/response';
import { DBControllerInterface } from './database/DBController';
import { EventFilter } from './models/event/event.factory';


export class EventController {
  constructor(private controller: DBControllerInterface) {}

  /**
  * Returns a list of _upcoming_ events
  *
  * Can be filtered using the 'term' query paramter
  * - all:    GET /events
  * - search: GET /events?term='blumen'
  */
  async list(request: Request, response: Response): Promise<void> {
    try {
      const filter: EventFilter = {};

      if (request.query.term) {
        filter.term = String(request.query.term);
      }

      const events = await this.controller.events.filterUpcoming(filter);

      APIResponse.success(events).send(response);
    } catch (err) {
      console.error(err);
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
