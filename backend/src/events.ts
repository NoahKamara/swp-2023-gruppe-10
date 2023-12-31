import { DBEvent, PublicEvent } from './models/event/event.db';
import { Request, Response } from 'express';
import { APIResponse } from './models/response';
import { DBControllerInterface } from './database/DBController';
import { EventFilter, EventListItem, User } from 'softwareproject-common';
import { z } from 'zod';
import { validateBody } from './validation/requestValidation';
import { DBFavorites } from './models/db.favorites';


const filterSchema = z.object({
  term: z.string().optional(),
  locations: z.array(z.string()).optional(),
  startDate: z.preprocess(arg => typeof arg === 'string' ? new Date( arg ) : undefined, z.date().optional()),
  endDate: z.preprocess(arg => typeof arg === 'string' ? new Date( arg ) : undefined, z.date().optional()),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  onlyFavorites: z.boolean().optional()
});

export const  listItem = (item: PublicEvent): EventListItem => {
  return {
    id: item.id,
    title: item.title,
    picture: item.picture,
    start_date: item.start_date,
    end_date: item.end_date,
    start_time: item.start_time,
    end_time: item.end_time,
    price: item.price,
  };
};

export class EventController {
  constructor(private controller: DBControllerInterface) {}

  async filterUpcoming(request: Request, response: Response): Promise<void> {
    const user: User = response.locals.session?.user;

    if (!user || !user.id) {
      APIResponse.unauthorized().send(response);
      return;
    }
    try {
      const filter = validateBody(request,response,filterSchema);

      if (!filter) {
        return;
      }

      const realFilter: EventFilter = {
        ...filter,
        startDate: undefined,
        endDate: undefined
      };

      if (filter.startDate) {
        realFilter.startDate = filter.startDate as Date;
      }

      if (filter.endDate) {
        realFilter.endDate = filter.endDate as Date;
      }

      const events = await this.controller.events.filterUpcoming(realFilter, user.id);

      APIResponse.success(events.map(e => listItem(e))).send(response);
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
    const user: User = response.locals.session?.user;

    if (!user || !user.id) {
      APIResponse.unauthorized().send(response);
      return;
    }
    try {
      const filter = filterSchema.parse(request.body);

      console.log('FILTER', filter);

      if (filter.locations) {
        console.log('LOCATIONS', filter.locations.length);
      }
      if (request.query.term) {
        filter.term = String(request.query.term);
      }

      const events = await this.controller.events.filterUpcoming(filter,user.id);

      APIResponse.success(events.map(e => listItem(e))).send(response);
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
  async toggleFavorite(request: Request, response: Response): Promise<void>{
    const user: User = response.locals.session?.user;

    if (!user || !user.id) {
      APIResponse.unauthorized().send(response);
      return;
    }

    const id = request.params.id;

    if (!id) {
      APIResponse.badRequest('Missing "ID" in path').send(response);
      return;
    }

    console.log('find fav');
    const favorite = await DBFavorites.findOne({
      where:{
        user_id: user.id,
        event_id: id,
      }
    });

    console.log(favorite);

    if (favorite) {
      console.log('destroy fav');
      // Remove Favorite
      await favorite.destroy();
      APIResponse.success().send(response);
      return;
    } else {
      console.log('make fav');
      // Make Favorite
      await DBFavorites.create({
        user_id: user.id,
        event_id: id,
      });
      APIResponse.success().send(response);
      return;
    }
  }

  async isFavorite(request: Request, response: Response): Promise<boolean>{
    const user: User = response.locals.session?.user;
    if (!user || !user.id) {
      APIResponse.unauthorized().send(response);
      return false;
    }
    const id = request.params.id;
    let exists = false;
    const isFavorite = await DBFavorites.findOne({
      where:{
        user_id: user.id,
        event_id: id,
      }});
      if(!isFavorite){
        exists = false;
      }
      else{
        exists = true;
      }
      response.status(200),
      response.send(exists);
      return exists;
  }

  }

  // async deleteFavourite(request: Request, response: Response): Promise<void>{
  //   const user: User = response.locals.session?.user;
  //   if (!user || !user.id) {
  //     APIResponse.unauthorized().send(response);
  //     return;
  //   }

  //   const id = request.params.id;

  //   if (!id) {
  //     APIResponse.badRequest('Missing "ID" in path').send(response);
  //     return;
  //   }
  //   try{
  //   await DBFavorites.destroy({
  //     where:{
  //       user_id: user.id,
  //       event_id: id
  //     }});
  //     response.status(200);
  //     response.send();
  //   }
  //   catch(err){
  //     APIResponse.notFound('did not find favorite').send(response);
  //       return;
  //   }
  // }


