import { Request, Response } from 'express';
import { User } from 'softwareproject-common';
import { DBTicket } from './models/db.ticket';
import { DBEvent } from './models/db.event';
import { Ticket } from 'softwareproject-common';
import { DBUser } from './models/db.user';
import { APIResponse } from './models/response';

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

      const publicTickets = tickets.map((ticket) => {
        return {
          id: ticket.id,
          user: ticket.user,
          event: {
            id: ticket.event.id,
            title: ticket.event.title,
            start_date: ticket.event.start_date,
            end_date: ticket.event.end_date,
            price: ticket.event.price,
            picture: ticket.event.picture
          }
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

  async purchase(request: Request, response: Response): Promise<void> {
    const user: User = response.locals.session?.user;

    if (!user) {
      APIResponse.unauthorized().send(response);
      return;
    }

    const id = request.params.id;

    if (!id) {
      APIResponse.badRequest('client did not provide event-id').send(response);
      return;
    }

    // const userInfo = validateBody(request, response, purchaseTicketSchema);
    // if (!userInfo) return;


    const event = await DBEvent.findByPk(id);

    if (!event) {
      request.logger.error('event id was invalid');
      response.status(400);
      response.send();
      return;
    }

    console.log({
      user_id: user.id,
      event_id: event.id
    });

    try {
      const ticket = await DBTicket.create({
        user_id: user.id,
        event_id: event.id
      });

      response.status(200);
      response.send(ticket);

    } catch (err) {
      request.logger.error(err);
      response.send({ code: 500, message: err });
    }
  }

  async purchaseBC(request: Request, response: Response): Promise<void> {
    response.status(500);
    response.send();
  }

  async purchaseSWP(request: Request, response: Response): Promise<void> {
    response.status(500);
    response.send();
  }

  async purchaseHCI(request: Request, response: Response): Promise<void> {
    response.status(500);
    response.send();
  }
}
