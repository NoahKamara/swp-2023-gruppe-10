
import { RequestLogger } from '../utils/logger';
import { PaymentError } from 'softwareproject-common';


export abstract class PaymentProviderInterface<AccountData> {
  abstract verifyAccountCountry(data: AccountData): Promise<boolean>
  abstract validatePayment(data: AccountData, amount: number): Promise<string>
  abstract executePayment(token: string): Promise<void>

  async pay(data: AccountData, amount: number, logger: RequestLogger): Promise<void> {
    // 1: Validate Country is Germany
    try {
      const isGermanAccount = await this.verifyAccountCountry(data);

      if (!isGermanAccount) {
        logger.error('account is foreign');
        throw PaymentError.foreignAccount;
      }
    } catch (err) {
      logger.info(err);
      throw err;
    }


    logger.info('account is german');

    // 2: Validate Payment (Get Token)
    logger.info('validate');
    const token = await this.validatePayment(data, amount);
    logger.info('validation token', token);

    // 3: Execute Payment
    logger.info('execute');
    await this.executePayment(token);

    logger.info('payment was executed');
    return;
  }

}
