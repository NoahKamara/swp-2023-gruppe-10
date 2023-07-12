import { PaymentProviderInterface } from './PaymentProviderInterface';
import { BachelorcardData, PaymentError } from 'softwareproject-common';
import axios from 'axios';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

type BCRequestContainer = {
  transactionRequest: {
    attrib_type: string
    version: string
    merchantInfo: { name: string }
  }
}

const buildRequest = (type: string, extension: object): unknown => {
  const dataObj: BCRequestContainer = {
    transactionRequest: {
      attrib_type: type,
      version: '1.0.0',
      merchantInfo: { name: 'SWP-10' },
      ...extension
    }
  };

  const xmlBuilder = new XMLBuilder({
    attributeNamePrefix: 'attrib_',
    ignoreAttributes: false,
    format: true
  });

  const xml = xmlBuilder.build(dataObj);

  return xml;
};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseResponse = (data: string): any => {
  const parser = new XMLParser();
  const resData = parser.parse(data);
  return resData.transactionResponse.response;
};



export class BachelorCardProvider extends PaymentProviderInterface<BachelorcardData> {

  private baseURI = 'https://pass.hci.uni-konstanz.de/bachelorcard';

  async verifyAccountCountry(data: BachelorcardData): Promise<boolean> {
    const request = buildRequest('country', { cardNumber: data.number });

    const res = await axios.post(this.baseURI, request).then(
      (res) => { return parseResponse(res.data); },
      (err) => { return parseResponse(err.response.data); }
    );

    if (res.status !== '200: Success') {
      throw PaymentError.parse(res.error);
    }

    const country = res['transaction-data'].country;
    const isGerman = country === 'de';

    return Promise.resolve(isGerman);
  }

  async validatePayment(data: BachelorcardData, amount: number): Promise<string> {
    const request = buildRequest('validate', {
      payment: {
        attrib_type: 'bachelorcard',
        paymentDetails: {
          cardNumber: data.number,
          name: data.name,
          securityCode: data.code,
          expirationDate: data.date,
        },
        dueDetails: {
          amount: amount,
          currency: 'EUR',
          country: 'de'
        }
      }
    });

    const res = await axios.post(this.baseURI, request).then(
      (res) => { return parseResponse(res.data); },
      (err) => { return parseResponse(err.response.data); }
    );

    if (res.status !== '200: Success') {
      throw PaymentError.parse(res.error);
    }

    return Promise.resolve(res['transaction-data'].transactionCode);
  }

  async executePayment(token: string): Promise<void> {
    const request = buildRequest('pay', {
      transactionCode: token
    });

    const res = await axios.post(this.baseURI, request).then(
      (res) => { return parseResponse(res.data); },
      (err) => { return parseResponse(err.response.data); }
    );

    if (res.status !== '200: Success') {
      throw PaymentError.parse(res.error);
    }
  }
}
