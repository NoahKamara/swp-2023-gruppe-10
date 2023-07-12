/* eslint-disable jasmine/no-spec-dupes */
import { PaymentProvider, PaymentError, SWPsafeData } from 'softwareproject-common';
import { HCIPalData } from '../src/payment/HCIPalProvider';
import { authorize, getInfo } from './helpers/user-helper';
import app from '../src/app';
import { SuperAgentTest } from 'supertest';
import { matcher } from './helpers/responseMatching';
import { APIResponse } from '../src/models/response';
import { Response } from 'supertest';
import { BachelorcardData } from 'softwareproject-common';
/**
 * Requests can take up to 6 seconds
 * > https://gitlab.inf.uni-konstanz.de/ag-hci/lectures/2023-software-projekt/swp-2023-beispiele/-/wikis/Zahlungssysteme#:~:text=Requests%20k%C3%B6nnen%20bis%20zu%206%20Sekunden%20dauern.%20Ein%20entsprechendes%20Userfeedback%20(z.B.%20Ladeindikator%20sobald%20der%20Button%20gedr%C3%BCckt%20wird)%20wird%20erwartet.
 */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('General', () => {
  const path = (eventID: number, amount: number): string => {
    return `/api/purchase?event=${eventID}&provider=${PaymentProvider.hciPal}&amount=${amount}`;
  };
  let agent: SuperAgentTest;
  let userID: number;

  const eventID = 1;

  beforeEach(async () => {
     agent = await authorize(app);
     userID  = (await getInfo(agent)).id;
  });

  it('fails - unknown event', async () => {
    const data = SWPSafeExamples.normal;
    const invalidEventID = 999;
    await agent
      .post(path(invalidEventID,1))
      .send(data)
      .expect(matcher(APIResponse.badRequest(`Not Event with ID '${invalidEventID}'`)));
  });


  it('fails - invalid amount', async () => {
    const data = SWPSafeExamples.normal;

    await agent
      .post(path(eventID,-1))
      .send(data)
      .expect(400);
  });
});

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

export const payError = (expected: PaymentError): (res: Response) => void => {
  return (res) => {
    matcher(APIResponse.failure(expected.code, expected.message))(res);
  };
};




describe('HCIPal', () => {
  const path = (eventID: number, amount: number): string => {
    return `/api/purchase?event=${eventID}&provider=${PaymentProvider.hciPal}&amount=${amount}`;
  };
  let agent: SuperAgentTest;
  let userID: number;

  const eventID = 1;

  beforeEach(async () => {
     agent = await authorize(app);
     userID  = (await getInfo(agent)).id;
  });

  it('succeeds', async () => {
    const data = HCIPalDataExamples.normal;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect( res => {
        expect(res.status).toEqual(200);
        expect(res.body.event_id).toEqual(eventID);
        expect(res.body.user_id).toEqual(userID);
      });
  });

  it('unknown account', async () => {
    const data: HCIPalData = { name: 'wrong', password: HCIPalDataExamples.normal.password };

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.unknownAccount));
  });

  it('wrong password', async () => {
    const data: HCIPalData = { name: HCIPalDataExamples.normal.name, password: 'wrongpass' };

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.invalidData));
  });

  it('not enough balance', async () => {
    const data: HCIPalData = HCIPalDataExamples.broke;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.notEnoughBalance));
  });


  it('foreign account', async () => {
    const data = HCIPalDataExamples.foreign;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.foreignAccount));
  });

  it('no money in account', async () => {
    const data = HCIPalDataExamples.broke;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.notEnoughBalance));
  });

  it('just enough money in account for 1 ticket', async () => {
    const data = HCIPalDataExamples.poor;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect( res => {
        expect(res.status).toEqual(200);
        expect(res.body.event_id).toEqual(eventID);
        expect(res.body.user_id).toEqual(userID);
      });
  });

  it('not enough money in account for 3 ticketss', async () => {
    const data = HCIPalDataExamples.poor;
    await agent
      .post(path(eventID,4))
      .send(data)
      .expect(payError(PaymentError.notEnoughBalance));
  });
});

class SWPSafeExamples {
  static normal: SWPsafeData = {
    code: 'y^t@y7#uMYu@'
  };

  static foreign: SWPsafeData = {
    code: 'Ms7wa#%@^9Xi'
  };

  static poor: SWPsafeData = {
    code: 'k@8NqfLJ%Bx9'
  };

  static broke: SWPsafeData = {
    code: '^iexa&8#53iE'
  };
}

describe('SWPsafe', () => {
  const path = (eventID: number, amount: number): string => {
    return `/api/purchase?event=${eventID}&provider=${PaymentProvider.swpsafe}&amount=${amount}`;
  };
  let agent: SuperAgentTest;
  let userID: number;

  const eventID = 1;

  beforeEach(async () => {
     agent = await authorize(app);
     userID  = (await getInfo(agent)).id;
  });

  it('succeeds', async () => {
    const data = SWPSafeExamples.normal;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect( res => {
        console.log(res.body.context);

        expect(res.status).toEqual(200);
        expect(res.body.context).toBeUndefined();
        expect(res.body.event_id).toEqual(eventID);
        expect(res.body.user_id).toEqual(userID);
      });
  });

  it('unknown account', async () => {
    const data: SWPsafeData = { code: 'wrong' };

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.unknownAccount));
  });


  it('not enough balance', async () => {
    const data = SWPSafeExamples.broke;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.notEnoughBalance));
  });


  it('foreign account', async () => {
    const data = SWPSafeExamples.foreign;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.foreignAccount));
  });

  it('no money in account', async () => {
    const data = SWPSafeExamples.broke;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.notEnoughBalance));
  });

  it('just enough money in account for 1 ticket', async () => {
    const data = SWPSafeExamples.poor;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect( res => {
        expect(res.status).toEqual(200);
        expect(res.body.event_id).toEqual(eventID);
        expect(res.body.user_id).toEqual(userID);
      });
  });

  it('not enough money in account for 3 ticketss', async () => {
    const data = SWPSafeExamples.poor;
    await agent
      .post(path(eventID,4))
      .send(data)
      .expect(payError(PaymentError.notEnoughBalance));
  });
});



class BachelorCardExamples {
  static normal: BachelorcardData = {
    name: 'Paul Milgramm',
    number: '4485-5420-1334-7098',
    code: '000',
    date: '4/44'
  };

  static broke: BachelorcardData = {
    name: 'Petra Heisenberg',
    number: '4556-0108-9131-6241',
    code: '123',
    date: '3/33'
  };

  static expired: BachelorcardData = {
    name: 'Benjamin Schneider',
    number: '1010-1010-1010-1014',
    code: '101',
    date: '10/10'
  };

  static poor: BachelorcardData = {
    name: 'Dagmar Baumann',
    number: '0000-0000-0000-0000',
    code: '350',
    date: '1/23'
  };
}

describe('BachelorCard', () => {
  const path = (eventID: number, amount: number): string => {
    return `/api/purchase?event=${eventID}&provider=${PaymentProvider.bachelorcard}&amount=${amount}`;
  };
  let agent: SuperAgentTest;
  let userID: number;

  const eventID = 1;

  beforeEach(async () => {
     agent = await authorize(app);
     userID  = (await getInfo(agent)).id;
  });

  it('succeeds', async () => {
    const data = BachelorCardExamples.normal;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect( res => {
        console.log(res.body.context);

        expect(res.status).toEqual(200);
        expect(res.body.context).toBeUndefined();
        expect(res.body.event_id).toEqual(eventID);
        expect(res.body.user_id).toEqual(userID);
      });
  });

  it('unknown account', async () => {
    const data: BachelorcardData = { ...BachelorCardExamples.normal, number: '1234-1234-1234-1234' };

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.unknownAccount));
  });


  it('not enough balance', async () => {
    const data = BachelorCardExamples.broke;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.notEnoughBalance));
  });


  it('no money in account', async () => {
    const data = BachelorCardExamples.broke;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect(payError(PaymentError.notEnoughBalance));
  });

  it('just enough money in account for 1 ticket', async () => {
    const data = BachelorCardExamples.poor;

    await agent
      .post(path(eventID,1))
      .send(data)
      .expect( res => {
        expect(res.status).toEqual(200);
        expect(res.body.event_id).toEqual(eventID);
        expect(res.body.user_id).toEqual(userID);
      });
  });

  it('not enough money in account for 3 ticketss', async () => {
    const data = BachelorCardExamples.poor;
    await agent
      .post(path(eventID,4))
      .send(data)
      .expect(payError(PaymentError.notEnoughBalance));
  });
});
