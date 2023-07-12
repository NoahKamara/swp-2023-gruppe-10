import { DBEvent } from './models/event/event.db';
import { Request, Response } from 'express';
import { APIResponse } from './models/response';
import { DBControllerInterface } from './database/DBController';
import { EventFilter } from 'softwareproject-common';
import { z } from 'zod';
import { validateBody } from './validation/requestValidation';


const filterSchema = z.object({
  term: z.string().optional(),
  locations: z.array(z.string()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional()
});

export class EventController {
  constructor(private controller: DBControllerInterface) {}

  async filterUpcoming(request: Request, response: Response): Promise<void> {
    try {
      const filter = validateBody(request,response,filterSchema);
      const events = await this.controller.events.filterUpcoming(filter ?? {});

      APIResponse.success(events.map(e => e.listItem())).send(response);
    } catch (err) {
      console.error(err);
      APIResponse.internal(err).send(response);
    }
  }
  /**
  * Returns a list of _upcoming_ events
  *
  * Can be filtered using the 'term' query paramter
  * - all:    GET /events
  * - search: GET /events?term='blumen'
  */
  async list(request: Request, response: Response): Promise<void> {
    try {
      const filter = filterSchema.parse(request.query);

      console.log('FILTER', filter);
      console.log('FILTER', request.query);

      if (filter.locations) {
        console.log('LOCATIONS', filter.locations.length);
      }
      if (request.query.term) {
        filter.term = String(request.query.term);
      }

      const events = await this.controller.events.filterUpcoming(filter);

      APIResponse.success(events.map(e => e.listItem())).send(response);
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
