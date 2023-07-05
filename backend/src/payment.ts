import { Request, Response } from 'express';
import { User } from 'softwareproject-common';
import { DBTicket } from './models/db.ticket';
import { DBEvent } from './models/db.event';
import { Ticket } from 'softwareproject-common';
import { DBUser } from './models/db.user';
import { APIResponse } from './models/response';
import { PaymentProvider } from './payment/PaymentProvider';
import { number } from 'zod';
import { RequestLogger } from './utils/logger';
import { HCIPalData, HCIPalProvider } from './payment/HCIPalProvider';

export class PaymentController {
  async purchase(request: Request, response: Response): Promise<void> {
    const user: DBUser = response.locals.session?.user;

    if (!user) {
      APIResponse.unauthorized().send(response);
      return;
    }

    if (!request.query.provider) {
      APIResponse.badRequest('missing "provider" in query').send(response);
      return;
    }

    const provider = String(request.query.provider) as keyof typeof PaymentProvider;

    if (!request.query.amount) {
      APIResponse.badRequest('missing "amount" in query').send(response);
      return;
    }

    const amount = Number(request.query.amount);

    if (!request.query.event) {
      APIResponse.badRequest('missing "event" in query').send(response);
      return;
    }
    const eventID = Number(request.query.event);


    console.log(provider, amount, eventID);
    console.log(request.body);

    switch (provider) {
      case PaymentProvider.hciPal:
        await this.purchaseHCIPal({ user: user, eventID: eventID, amount: amount, data: request.body }, request.logger, response);
        break;
      default:
        APIResponse.internal('not implemented').send(response);
    }
  }

  async purchaseHCIPal({ user, eventID, amount, data }: { user: DBUser, eventID: number, amount: number, data: unknown }, logger: RequestLogger, response: Response): Promise<void> {
    logger.info('purchaseHCIPal', eventID, amount, JSON.stringify(data));
    const provider = new HCIPalProvider();

    const validatedData = data as HCIPalData;

    console.log(data);
    try {
      await provider.pay(validatedData, amount, logger);
    } catch (err) {
      logger.error(err);
      APIResponse.internal(err).send(response);
      return;
    }

    const ticket = await user.addTicket({ event: eventID, amount: amount });
    APIResponse.success(ticket).send(response);
  }

  async purchaseBC(request: Request, response: Response): Promise<void> {
    response.status(500);
    response.send();
  }
}
