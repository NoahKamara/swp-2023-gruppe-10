import { Request, Response } from 'express';
import { PublicTicket, User } from 'softwareproject-common';
import { DBTicket } from './models/db.ticket';
import { DBEvent, PublicEvent } from './models/event/event.db';
import { Ticket } from 'softwareproject-common';
import { DBUser } from './models/user/user.db';
import { APIResponse } from './models/response';
import { listItem } from './events';

export class TicketController {
  async list(request: Request, response: Response): Promise<void> {
    const user: User = response.locals.session?.user;

    if (!user || !user.id) {
      APIResponse.unauthorized().send(response);
      return;
    }

    try {
      const tickets = await DBTicket.findAll({
        where: {
          user_id: user.id
        },
        include: [DBUser, DBEvent]
      });

      const publicTickets: PublicTicket[] = tickets.map((ticket) => {
        const pub: PublicEvent = {
          ...ticket.event.dataValues,
          isFavorite: false
        };

        return  {
          id: ticket.id,
          user: ticket.user,
          amount: ticket.amount,
          event: listItem(pub)
        };
      });

      response.status(200);
      response.send(publicTickets);

    } catch (err) {
      request.logger.error(err);
      response.status(500);
      response.send({ error: err });
    }
  }

  async detail(request: Request, response: Response): Promise<void> {
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

    try {
      const ticket = await DBTicket.findByPk(id, { include: [DBUser, DBEvent] });

      if (!ticket || ticket.user_id !== user.id) {
        APIResponse.notFound().send(response);
        return;
      }

      const publicTickets = {
        id: ticket.id,
        user: ticket.user,
        amount: ticket.amount,
        event: listItem({
          isFavorite: false,
          ...ticket.event.dataValues
        })
      };

      response.status(200);
      response.send(publicTickets);

    } catch (err) {
      request.logger.error(err);
      response.status(500);
      response.send({ error: err });
    }
  }
}
