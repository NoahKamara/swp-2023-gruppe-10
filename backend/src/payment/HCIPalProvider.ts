import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { PaymentProvider, PaymentProviderErrors } from './PaymentProvider';

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

const handleErrorResponse = (err: unknown, handler: (response: AxiosResponse) => void): void => {
  if (err instanceof AxiosError && err.response) {
    handler(err.response);
  }
};

export class HCIPalProvider extends PaymentProvider<HCIPalData> {
  private options = {
    hostname: 'pass.hci.uni-konstanz.de',
    port: 443,
  };

  private baseURI = 'https://pass.hci.uni-konstanz.de/hcipal';

  async verifyAccountCountry(data: HCIPalData): Promise<boolean> {
    const body = { accountName: data.name };

    const res = await axios.post(this.baseURI + '/country', body);

    const result: HCIPalCountryResponse = res.data;

    return Promise.resolve(result.country === 'germany');
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
      handleErrorResponse(err, (response) => {
        const data: HCIPalError= JSON.parse('{}');

        // Throw Specific error for balance
        if (data.error === 'Not enough balance on account') {
          console.log(data.error);
          throw Error(PaymentProviderErrors.notEnoughBalance);
        }
        console.log('unhandled', data.error);
      });
      if (err instanceof AxiosError) {
        const data: HCIPalError = err.response?.data;
        console.log(data);
        // Throw Specific error for balance
        if (data.error === 'Not enough balance on account') {
          console.log(data.error);
          throw Error(PaymentProviderErrors.notEnoughBalance);
        }
        console.log('unhandled', data.error);

        throw err;
      }

      console.error(err);
      throw Error(PaymentProviderErrors.internalError);
    }
  }

  async executePayment(token: string): Promise<void> {
    try {
      await axios.post(this.baseURI + '/check', {token: token});
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
