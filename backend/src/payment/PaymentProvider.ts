
import https, { RequestOptions } from 'https';

export enum PaymentProviderErrors {
  foreignAccount = 'cannot process foreign account',
  notEnoughBalance = 'Not enough balance',
  internalError = 'Internal Server Error'
}

type PaymentResult = {
  success: boolean;
  error?: string;
}


export abstract class PaymentProvider<AccountData> {
  abstract verifyAccountCountry(data: AccountData): Promise<boolean>
  abstract validatePayment(data: AccountData, amount: number): Promise<string>
  abstract executePayment(token: string): Promise<void>

  async pay(data: AccountData, amount: number): Promise<void> {
    // 1: Validate Country is Germany
    const isGermanAccount = await this.verifyAccountCountry(data);

    if (!isGermanAccount) {
      throw Error(PaymentProviderErrors.foreignAccount);
    }
    console.info('account is german');

    // 2: Validate Payment (Get Token)
    const token = await this.validatePayment(data, amount);
    console.info('payment was verified', token);

    // 3: Execute Payment
    // 2: Validate Payment (Get Token)
    await this.executePayment(token);
    console.info('payment was executed');
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
