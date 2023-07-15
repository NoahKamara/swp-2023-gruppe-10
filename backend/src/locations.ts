import { Request, Response } from 'express';
import { DBLocation } from './models/db.location';
import { APIResponse } from './models/response';

export class LocationController {
  /**
  * Returns a list of locations
  */
  async list(request: Request, response: Response): Promise<void> {
    try {
      const locations = await DBLocation.findAll();
      APIResponse.success(locations).send(response);
    } catch (err) {
      APIResponse.internal(err).send(response);
      response.status(500);
    }
  }

  /**
   * returns details for a location by name
   */
  async lookup(request: Request, response: Response): Promise<void> {
    const name = request.params.name;
    console.log(name);
    if (!name) {
      console.error('client not provide name');
      APIResponse.badRequest('Missing :name in path').send(response);
    }

    try {
      const location = await DBLocation.lookup(name);


      if (!location) {
        console.error('did not find location for id');
        APIResponse.notFound(`No location with name ${name}`).send(response);
        return;
      }

      APIResponse.success(location).send(response);
    } catch (err) {
      APIResponse.internal(err).send(response);
    }
    return;
  }

  /**
   * returns rating for a location by name
   */
   async lookup2(request: Request, response: Response): Promise<void> {
    const name = request.params.name;
    console.log(name);
    if (!name) {
      console.error('client not provide name');
      APIResponse.badRequest('Missing :name in path').send(response);
    }

    try {
      const rating = await DBLocation.lookup2(name);


      if (!rating) {
        console.error('did not find location for id');
        APIResponse.notFound(`No location with name ${name}`).send(response);
        return;
      }

      APIResponse.success(rating).send(response);
    } catch (err) {
      APIResponse.internal(err).send(response);
    }
    return;
  }

}
