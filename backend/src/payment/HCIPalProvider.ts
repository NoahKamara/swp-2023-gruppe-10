import { PaymentProviderInterface } from './PaymentProvider';
import { PaymentError } from 'softwareproject-common';
import { handleErrorResponse } from './util';
import axios, { AxiosError } from 'axios';

export type HCIPalData = {
  name: string;
  password: string;
}

type HCIPalError = {
  status: number;
  error: string;
}

type HCIPalCountryResponse = {
  success: boolean;
  country: string;
  error?: string
}

type HCIPalPaymentValidationResponse = {
  success: boolean;
  token?: string;
  status?: number;
  error?: string;
}

type HCIPalPaymentValidationSuccess = {
  token: string
}

export class HCIPalProvider extends PaymentProviderInterface<HCIPalData> {
  private options = {
    hostname: 'pass.hci.uni-konstanz.de',
    port: 443,
  };

  private baseURI = 'https://pass.hci.uni-konstanz.de/hcipal';

  async verifyAccountCountry(data: HCIPalData): Promise<boolean> {
    const body = { accountName: data.name };

    const res = await axios.post(this.baseURI + '/country', body);
    const result: HCIPalCountryResponse = res.data;

    if (result.success === true) {
      return Promise.resolve(result.country === 'germany');
    } else if (result.error === 'Unknown payment account') {
      throw PaymentError.unknownAccount;
    } else {
      throw Error(result.error ?? 'Unknown Error');
    }
  }

  async validatePayment(data: HCIPalData, amount: number): Promise<string> {
    const body = {
      accountName: data.name,
      accountPassword: data.password,
      amount: amount
    };

    try {
      const res = await axios.post(this.baseURI + '/check', body);
      return res.data.token;
    } catch (err) {
      // Check if error is AxiosError (e.g. Status 400 - not enough money)
      throw handleErrorResponse(err, (response) => {
        const data: HCIPalError = response.data;

        // Throw Specific error for balance
        if (data.error === 'Not enough balance on account') {
          return PaymentError.notEnoughBalance;
        } else if (data.error === 'Invalid data') {
          return PaymentError.invalidData;
        }

        console.log('unhandled', data.error);

        return err;
      });
    }
  }

  async executePayment(token: string): Promise<void> {
    try {
      await axios.post(this.baseURI + '/payment', {token: token});
    } catch (err) {
      throw handleErrorResponse(err, res => {
        console.log(res);
        return err;
      });
    }
  }
}
