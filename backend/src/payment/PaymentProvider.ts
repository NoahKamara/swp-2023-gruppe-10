
import https, { RequestOptions } from 'https';
import { RequestLogger } from '../utils/logger';

export enum PaymentProviderErrors {
  foreignAccount = 'cannot process foreign account',
  notEnoughBalance = 'Not enough balance',
  internalError = 'Internal Server Error'
}

type PaymentResult = {
  success: boolean;
  error?: string;
}

export enum PaymentProvider {
  bachelorcard = 'bachelorcard',
  hciPal = 'hciPal',
  swpsafe = 'swpsafe'
}


export abstract class PaymentProviderInterface<AccountData> {
  abstract verifyAccountCountry(data: AccountData): Promise<boolean>
  abstract validatePayment(data: AccountData, amount: number): Promise<string>
  abstract executePayment(token: string): Promise<void>

  async pay(data: AccountData, amount: number, logger: RequestLogger): Promise<void> {
    // 1: Validate Country is Germany
    const isGermanAccount = await this.verifyAccountCountry(data);

    if (!isGermanAccount) {
      logger.error('account is foreign');
      throw Error(PaymentProviderErrors.foreignAccount);
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




// type type SWPSafeCountryResponse = {
//   name: string
//   neutered: boolean
// }

// const dogSchema = z.object<Dog>({
//   name: z.string().min(3),
//   neutered: z.boolean(),
// });

// class SWPSafePaymentProvider implements PaymentProviderInterface<SWPSafeData> {
//   async validateCountry(data: SWPSafeData): Promise<boolean> {
//     const options = {
//       hostname: 'pass.hci.uni-konstanz.de',
//       port: 443, // https
//       path: `/swpsafe/country/code/${data.code}`,
//       method: 'GET'
//     };

//     return new Promise((resolve, reject) => {
//       https.request(options, res => {
//         res.on('data', d => {
//           console.log(d.toString());
//           JSON.parse(d.toString());

//         });
//       });
//     });





//     throw new Error('Method not implemented.');
//   }

//   async validatePayment(data: SWPSafeData): Promise<string> {
//     throw new Error('Method not implemented.');
//   }

//   async processPayment(data: SWPSafeData): Promise<void> {
//     throw new Error('Method not implemented.');
//   }
// }
