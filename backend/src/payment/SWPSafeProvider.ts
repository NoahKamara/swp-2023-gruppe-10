import axios from 'axios';
import { PaymentProvider } from './PaymentProvider';
import { parse } from 'csv-parse';
import { handleErrorResponse } from './util';

export type SWPSafeData = {
  code: string
}


type SWPSafeCountryResponse = {
  responseCode: string
  errorMessage: string
  swpCode: string
  country: string
}

type SWPSafeValidationResponse = {
  status: string
  errorMessage: string
  token: string
}

type SWPSafeProcessingResponse = {
  status: string
  errorMessage: string
}

// type PaymentProviderError {
//   message: string
// }

export class SWPSafeProvider extends PaymentProvider<SWPSafeData> {
  private baseURI = 'https://pass.hci.uni-konstanz.de/swpsafe';

  async verifyAccountCountry(data: SWPSafeData): Promise<boolean> {
    const uri = this.baseURI + '/country/code/' + encodeURIComponent(data.code);

    const res = await axios.get(uri);

    return new Promise((resolve, reject) => {
      parse(res.data, {
        delimiter: ',',
        from_line: 2,
        columns: ['responseCode','errorMessage','swpCode','country'],
      }, (error, result: SWPSafeCountryResponse[]) => {
        if (error) {
          console.error(error);
          reject('Error Parsing CSV');
          return;
        }

        const isGerman = result[0].country === 'Deutschland';
        resolve(isGerman);
      });
    });
  }

  async validatePayment(data: SWPSafeData, amount: number): Promise<string> {
    const uri = this.baseURI + '/check/code/' + encodeURIComponent(data.code) + '/amount/' + amount;
    const res = await axios.get(uri);

    return new Promise((resolve, reject) => {
      parse(res.data, {
        delimiter: ',',
        from_line: 2,
        columns: ['status','errorMessage','token'],
      }, (error, result: SWPSafeValidationResponse[]) => {
        if (error) {
          console.error(error);
          reject('Error Parsing CSV');
          return;
        }

        const res = result[0];

        if (res.status !== '200') {
          reject(res.errorMessage);
          return;
        }

        resolve(res.token);
      });
    });
  }

  async executePayment(token: string): Promise<void> {
    const uri = this.baseURI + '/use/' + token;
    const res = await axios.get(uri);

    return new Promise((resolve, reject) => {
      parse(res.data, {
        delimiter: ',',
        from_line: 2,
        columns: ['status','errorMessage'],
      }, (error, result: SWPSafeProcessingResponse[]) => {
        if (error) {
          console.error(error);
          reject('Error Parsing CSV');
          return;
        }

        const res = result[0];

        if (res.status !== '200') {
          reject(res.errorMessage);
          return;
        }

        resolve();
      });
    });

    throw Error('not implemented');
  }
}
