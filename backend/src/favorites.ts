import { Request, Response } from 'express';
import { User } from 'softwareproject-common';
import { Favorite } from 'softwareproject-common/dist/favorite';
import { DBEvent } from './models/event/event.db';
import { DBUser } from './models/user/user.db';
import { DBFavorites } from './models/db.favorites';
import { APIResponse } from './models/response';


export class FavoritenController {
  async list(request: Request, response: Response): Promise<void> {
    const user: User = response.locals.session?.user;

    if (!user || !user.id) {
      APIResponse.unauthorized().send(response);
      return;
    }

    const favorites = await DBFavorites.findAll({
      where: {
        user_id: user.id
      },
      include: [DBUser, DBEvent]
    });

    response.status(200);
    response.send(favorites);
  }

  async makeFavorite(request: Request, response: Response): Promise<void> {
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


    // const userInfo = validateBody(request, response, purchaseTicketSchema);
    // if (!userInfo) return;

      const favorite = await DBFavorites.create({
        user_id: user.id,
        event_id: id,
      });
      response.status(200);
      response.send(favorite);
  }
  
  async deleteFavourite(request: Request, response: Response): Promise<void>{
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
    try{
    const favorites = await DBFavorites.destroy({
      where:{
        user_id: user.id,
        event_id: id
      }});
    }
    catch(err){
      APIResponse.notFound('did not find favorite').send(response);
        return;
    }
  }

  async findFavorites(request: Request, response: Response): Promise<void>{
    const user: User = response.locals.session?.user;
    if (!user || !user.id) {
      APIResponse.unauthorized().send(response);
      return;
    }


  }
}
