import axios from 'axios';
import { PaymentProviderInterface } from './PaymentProvider';
import { PaymentError } from 'softwareproject-common';
import { parse } from 'csv-parse';

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
  status: number
  errorMessage: string
  token: string
}

type SWPSafeProcessingResponse = {
  status: string
  errorMessage: string
}


const parseResponse = <T>(data: string, columns: string[]): Promise<T> => {
  return new Promise((resolve, reject) => {
    parse(data, {
      delimiter: ',',
      from_line: 2,
      columns: columns
    }, (error, result: T[]) => {
      if (error) {
        reject('Error Parsing CSV');
        return;
      }
      resolve(result[0]);
    });
  });
};

export class SWPSafeProvider extends PaymentProviderInterface<SWPSafeData> {
  private baseURI = 'https://pass.hci.uni-konstanz.de/swpsafe';

  async handleError(message: string): Promise<PaymentError|Error> {
    switch (message) {
      case 'Could not find matching account, please retry with correct URL':
        return PaymentError.unknownAccount;
      case 'Not enough balance on account':
        return PaymentError.notEnoughBalance;
    }

    return Error('Unknown');
  }

  async verifyAccountCountry(data: SWPSafeData): Promise<boolean> {
    const uri = this.baseURI + '/country/code/' + encodeURIComponent(data.code);

    const res: SWPSafeCountryResponse = await axios.get(uri).then(
      (res) => { return parseResponse(res.data, ['responseCode','errorMessage','swpCode','country']); },
      (err) => { return parseResponse(err.response.data, ['responseCode','errorMessage','swpCode','country']); }
    );

    if (res.errorMessage) {
      throw await this.handleError(res.errorMessage);
    }

    const isGerman = res.country === 'Deutschland';
    return Promise.resolve(isGerman);
  }

  async validatePayment(data: SWPSafeData, amount: number): Promise<string> {
    const uri = this.baseURI + '/check/code/' + encodeURIComponent(data.code) + '/amount/' + amount;
    const res: SWPSafeValidationResponse = await axios.get(uri).then(
      (res) => { return parseResponse(res.data, ['status','errorMessage','token']); },
      (err) => { return parseResponse(err.response.data, ['status','errorMessage','token']); }
    );

    if (res.errorMessage) {
      throw await this.handleError(res.errorMessage);
    }

    return res.token;
  }

  async executePayment(token: string): Promise<void> {
    const uri = this.baseURI + '/use/' + token;
    const res: SWPSafeProcessingResponse = await axios.get(uri).then(
      (res) => { return parseResponse(res.data, ['status','errorMessage']); },
      (err) => { return parseResponse(err.response.data, ['status','errorMessage']); }
    );

    if (res.status !== '200') {
      throw await this.handleError(res.errorMessage);
    }
  }
}
