import { PaymentProviderErrors } from '../src/payment/PaymentProvider';
import { HCIPalProvider, HCIPalData } from '../src/payment/HCIPalProvider';
import { SWPSafeProvider, SWPSafeData } from '../src/payment/SWPSafeProvider';

/**
 * Requests can take up to 6 seconds
 * > https://gitlab.inf.uni-konstanz.de/ag-hci/lectures/2023-software-projekt/swp-2023-beispiele/-/wikis/Zahlungssysteme#:~:text=Requests%20k%C3%B6nnen%20bis%20zu%206%20Sekunden%20dauern.%20Ein%20entsprechendes%20Userfeedback%20(z.B.%20Ladeindikator%20sobald%20der%20Button%20gedr%C3%BCckt%20wird)%20wird%20erwartet.
 */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

class HCIPalDataExamples {
  static normal: HCIPalData = {
    name: 'paul@milgram.de',
    password: 'zJac6Em^q7JrG@w!FMf4@'
  };

  static foreign: HCIPalData = {
    name: 'b.schneider@gov.us',
    password: '*REc#YbCMj6WaWmksYm9*'
  };

  static poor: HCIPalData = {
    name: 'hcipal@baumann.de',
    password: 'TQxeqbztPAQvopE*Bi9E*'
  };

  static broke: HCIPalData = {
    name: 'petra@heisenberg.eu',
    password: '6uTQu8DhqXVz!!fXpGcD5'
  };
}

describe('HCIPal', () => {
  const hcipal = new HCIPalProvider();

  it('succeeds', async () => {
    const data = HCIPalDataExamples.normal;
    const amount = 1;

    expectAsync(hcipal.pay(data, amount)).toBeResolved();
  });

  it('fails - foreign account', async () => {
    const data = HCIPalDataExamples.foreign;
    const amount = 10;

    await expectAsync(hcipal.pay(data, amount))
      .toBeRejectedWithError(PaymentProviderErrors.foreignAccount);
  });

  it('fails - no money in account', async () => {
    const data = HCIPalDataExamples.broke;
    const amount = 1;

    expectAsync(hcipal.pay(data, amount))
      .toBeRejectedWithError(PaymentProviderErrors.notEnoughBalance);
  });

  it('succeeds - just enough money in account', async () => {
    const data = HCIPalDataExamples.poor;
    const amount = 1;
  await hcipal.pay(data, amount);
    expectAsync(hcipal.pay(data, amount)).toBeResolved();
  });

  it('fails - not enough money in account', async () => {
    const data = HCIPalDataExamples.poor;
    const amount = 10;

    expectAsync(hcipal.pay(data, amount))
      .toBeRejectedWithError(PaymentProviderErrors.notEnoughBalance);
  });
});

class SWPSafeExamples {
  static normal: SWPSafeData = {
    code: 'y^t@y7#uMYu@'
  };

  static foreign: SWPSafeData = {
    code: 'Ms7wa#%@^9Xi'
  };

  static poor: SWPSafeData = {
    code: 'k@8NqfLJ%Bx9'
  };

  static broke: SWPSafeData = {
    code: '^iexa&8#53iE'
  };
}

describe('SWPsafe', () => {
  const provider = new SWPSafeProvider();

  it('succeeds', async () => {
    const data = SWPSafeExamples.normal;
    const amount = 1;

    expectAsync(provider.pay(data, amount))
      .toBeResolved();
  });

  it('fails - foreign account', async () => {
    const data = SWPSafeExamples.foreign;
    const amount = 10;

    await expectAsync(provider.pay(data, amount))
      .toBeRejectedWithError(PaymentProviderErrors.foreignAccount);
  });

  it('fails - no money in account', async () => {
    const data = SWPSafeExamples.broke;
    const amount = 1;

    expectAsync(provider.pay(data, amount))
      .toBeRejectedWithError(PaymentProviderErrors.notEnoughBalance);
  });

  it('succeeds - just enough money in account', async () => {
    const data = SWPSafeExamples.poor;
    const amount = 1;
  await provider.pay(data, amount);
    expectAsync(provider.pay(data, amount)).toBeResolved();
  });

  it('fails - not enough money in account', async () => {
    const data = SWPSafeExamples.poor;
    const amount = 10;

    expectAsync(provider.pay(data, amount))
      .toBeRejectedWithError(PaymentProviderErrors.notEnoughBalance);
  });
});
