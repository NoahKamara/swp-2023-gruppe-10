import { EventListItem } from 'softwareproject-common';
import { MockDBController } from '../../database/mock-controller';
import { EventFactory, EventFilter } from './event.factory';
import { EventInterface } from './event.interface';




export class MockEventFactory implements EventFactory<MockEvent> {
  constructor(private controller: MockDBController) { }

  filterUpcoming(filter: EventFilter): Promise<MockEvent[]> {
    throw Error('not implemented');
  }
}

export class MockEvent implements EventInterface {
  constructor(
    public id: number,
    public title: string,
    public start_date: Date,
    public end_date: Date,
    public start_time: string,
    public end_time: string,
    public location: string,
    public picture: string,
    public price: number,
    public description: string,
    public description_html: string,
    public controller: MockDBController
  ) {}

  listItem(): EventListItem {
    return {
      id: this.id,
      title: this.title,
      picture: this.picture,
      start_date: this.start_date,
      end_date: this.end_date,
      start_time: this.start_time,
      end_time: this.end_time,
      price: this.price
    };
  }
}
