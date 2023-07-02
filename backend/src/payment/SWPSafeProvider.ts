import axios, { AxiosError } from 'axios';
import { PaymentProvider, PaymentProviderErrors } from './PaymentProvider';
import csv from 'csv';
import { ZodLazy, unknown } from 'zod';
import { promisify } from 'util';

export type SWPSafeData = {
  code: string
}

export class SWPSafeProvider extends PaymentProvider<SWPSafeData> {
  private baseURI = 'https://pass.hci.uni-konstanz.de/swpsafe';

  async verifyAccountCountry(data: SWPSafeData): Promise<boolean> {
    const uri = this.baseURI + '/country/code/' + encodeURIComponent(data.code);
    const res = await axios.get(uri);
    console.log(res.data);

    return new Promise((resolve, reject) => {
      csv.parse(res.data, (res: unknown) => {
        console.log('RESULT', res);
        resolve(false);
      });
    });

    throw Error('Not Implemented');
  }

  async validatePayment(data: SWPSafeData, amount: number): Promise<string> {
    throw Error('not implemented');
  }

  async executePayment(token: string): Promise<void> {
    throw Error('not implemented');
  }
}
