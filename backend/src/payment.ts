import { Request, Response } from 'express';
import { DBUser } from './models/user/user.db';
import { APIResponse } from './models/response';
import { PaymentProvider, PaymentError } from 'softwareproject-common';
import { RequestLogger } from './utils/logger';
import { HCIPalData, HCIPalProvider } from './payment/HCIPalProvider';
import { SWPSafeData, SWPSafeProvider } from './payment/SWPSafeProvider';
import { BachelorCardData, BachelorCardProvider } from './payment/BachelorCardProvider';
import { DBEvent } from './models/event/event.db';

import { z } from 'zod';

const querySchema = z.object({
  amount: z.preprocess((val) => Number(val), z.number().gt(0)),
  event: z.preprocess((val) => Number(val), z.number().gte(0)),
  provider: z.preprocess(v => v as keyof typeof PaymentProvider, z.string())
});

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

    const query = querySchema.parse(request.query);

    const ticketAmount = query.amount;
    const eventID = query.event;
    const provider = query.provider as keyof typeof PaymentProvider;

    const event = await DBEvent.findByPk(eventID);
    if (!event) {
      APIResponse.badRequest(`Not Event with ID '${eventID}'`).send(response);
      return;
    }

    const amount = event.price * ticketAmount;

    console.log(provider, amount, eventID);
    console.log(request.body);

    try {
      switch (provider) {
        case PaymentProvider.hciPal.valueOf():
          await this.purchaseHCIPal({ eventID: eventID, amount: amount, data: request.body }, request.logger);
          break;
        case PaymentProvider.swpsafe.valueOf():
          await this.purchaseSWPSafe({ eventID: eventID, amount: amount, data: request.body }, request.logger);
          break;
        case PaymentProvider.bachelorcard.valueOf():
          await this.purchaseBachelorCard({ eventID: eventID, amount: amount, data: request.body }, request.logger);
          break;
        default:
          APIResponse.internal(`not implemented ${provider}`).send(response);
      }
    } catch(err) {
      console.log(err);
      if (err instanceof PaymentError) {
        APIResponse.failure(err.code, err.message).send(response);
      } else {
        APIResponse.internal(err).send(response);
      }
      return;
    }

    const ticket = await user.addTicket({ event: eventID, amount: ticketAmount });
    APIResponse.success(ticket).send(response);
  }

  async purchaseHCIPal({ eventID, amount, data }: { eventID: number, amount: number, data: unknown }, logger: RequestLogger): Promise<void> {
    logger.info('purchaseHCIPal', eventID, amount, JSON.stringify(data));
    const provider = new HCIPalProvider();

    const validatedData = data as HCIPalData;

    try {
      await provider.pay(validatedData, amount, logger);
    } catch (err) {
      throw err;
    }
  }

  async purchaseSWPSafe({ eventID, amount, data }: { eventID: number, amount: number, data: unknown }, logger: RequestLogger): Promise<void> {
    logger.info('purchaseSWPSafe', eventID, amount, JSON.stringify(data));
    const provider = new SWPSafeProvider();

    const validatedData = data as SWPSafeData;

    console.log(data);

    try {
      await provider.pay(validatedData, amount, logger);
    } catch (err) {
      throw err;
    }
  }

  async purchaseBachelorCard({ eventID, amount, data }: { eventID: number, amount: number, data: unknown }, logger: RequestLogger): Promise<void> {
    logger.info('purchaseBachelorCard', eventID, amount, JSON.stringify(data));
    const provider = new BachelorCardProvider();

    const validatedData = data as BachelorCardData;

    console.log(data);

    try {
      await provider.pay(validatedData, amount, logger);
    } catch (err) {
      throw err;
    }
  }
}
