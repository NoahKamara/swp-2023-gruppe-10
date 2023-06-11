/**
 *  In dieser Datei schreiben wir einen Controller, der Webrequests von
 *  dem in "app.ts" definierten Webserver beantwortet. Die Methoden werden
 *  in "app.ts" mit einer entsprechenden Webroute verknüpft.
 *  Jede Methode, die mit einer Webroute verknüpft wird, muss einen
 *  "Request" (was angefragt wird) und eine "response" (was unser Server antwortet)
 *  entgegennehmen.
 *  *Wichtig ist, dass jede Response zeitgemäß abgeschlossen wird*, z.B. via
 *  response.send(...data...)
 *  oder response.end()
 */
import { Request, Response } from 'express';

export class ApiController {
  public getInfo(request: Request, response: Response): void {
    response.status(200);
    response.send('ok');
  }

  public getMariusBerner(request: Request, response: Response): void {
    response.status(200);
    response.send({
      firstName: 'Marius',
      lastName: 'Berner',
      semester: '5th semester',
      course: 'Computer Science',
      mail: 'marius.berner@uni.kn'
    });
  }

  public getEmanuelMoell(request: Request, response: Response): void {
    response.status(200);
    response.send({
      firstName: 'Emanuel',
      lastName: 'Moell',
      semester: '?',
      course:'Computer Science',
      mail: 'emanuel.moell@uni.kn'
    });
  }

  /**
  * Gibt den Namen von Noah Kamara zurück
  */
  public getNoahKamara(request: Request, response: Response): void {
    response.status(200);
    response.send({
      firstName: 'Noah',
      lastName: 'Kamara',
      semester: '8th Semester',
      course: 'Computer Science',
      mail: 'noah.kamara@uni.kn'
    });
  }

  public getNiklasGroene(request: Request, response: Response): void{
    response.status(200);
    response.send({
      firstName: 'Niklas',
      lastName: 'Groene',
      semester: '6th semester',
      course: 'Computer Science',
      mail: 'niklas.groene@uni.kn'
    });
  }
}
