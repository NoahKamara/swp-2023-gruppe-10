
export type BachelorcardData = {
  name: string
  number: string
  code: string
  date: string
}

export type SWPsafeData = {
  code: string
}

export type HCIPalData = {
  name: string
  password: string
}


export enum PaymentErrorMessage {
  internalError = 'Internal Server Error',
  foreignAccount = 'cannot process foreign account',
  notEnoughBalance = 'Not enough balance',
  unknownAccount = 'Account existiert nicht',
  invalidData = 'Invalid Data',
  frozen = 'Account is frozen',
  expired = 'Bachelorcard is expired'
}


export class PaymentError {
  public code: number;
  public message: PaymentErrorMessage | string;
  public context?: string;

  constructor(code: number, message: PaymentErrorMessage, context: string | undefined = undefined) {
    this.code = code;
    this.message = message;
    this.context = context;
  }

  static internalError(context: string): PaymentError {
    return new PaymentError(500, PaymentErrorMessage.internalError, context);
  }

  static get foreignAccount(): PaymentError {
    return new PaymentError(400, PaymentErrorMessage.foreignAccount);
  }

  static get notEnoughBalance(): PaymentError {
    return new PaymentError(400, PaymentErrorMessage.notEnoughBalance);
  }

  static get unknownAccount(): PaymentError {
    return new PaymentError(400, PaymentErrorMessage.unknownAccount);
  }

  static get invalidData(): PaymentError {
    return new PaymentError(400, PaymentErrorMessage.invalidData);
  }

  static get frozen(): PaymentError {
    return new PaymentError(400, PaymentErrorMessage.frozen);
  }

  static get expired(): PaymentError {
    return new PaymentError(400, PaymentErrorMessage.expired);
  }

  static parse(message: string): PaymentError {
    switch (message) {
      case 'Unknown payment account':
        return this.unknownAccount;
      case 'Account is frozen':
        return this.frozen;
      case 'Not enough balance on account':
        return this.notEnoughBalance;
      case 'Bachelorcard is expired':
        return this.expired;
      default:
        return this.internalError(message);
    }
  }
}

export declare const enum PaymentProvider {
  bachelorcard = 'bachelorcard',
  hciPal = 'hcipal',
  swpsafe = 'swpsafe'
}
