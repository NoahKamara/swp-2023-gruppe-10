import { CreationOptional, Op, WhereOptions } from 'sequelize';
import { Column, Table, Model } from 'sequelize-typescript';
import { Event, EventListItem, EventFilter } from 'softwareproject-common';
import { EventFactory } from './event.factory';
import { EventInterface } from './event.interface';

@Table({ modelName: 'events', timestamps: false })
export class DBEvent extends Model<Event> implements EventInterface {

  static get factory(): EventFactory<DBEvent> {
    return {
      filterUpcoming: DBEvent.filterUpcoming
    };
  }

  declare id: CreationOptional<number>;

  @Column
  title!: string;

  @Column
  start_date!: Date;

  @Column
  end_date!: Date;

  @Column
  start_time!: string;

  @Column
  end_time!: string;

  @Column
  location!: string;

  @Column
  picture!: string;

  @Column
  price!: number;

  @Column
  description!: string;

  @Column
  description_html!: string;


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


  /**
   * Implements EventFactory.filterUpcoming
   */
  static async filterUpcoming(filter: EventFilter): Promise<DBEvent[]> {
    const where: WhereOptions<DBEvent> = {
      start_date: {
        [Op.gte]: Date.now()
      }
    };

    if (filter.term) {
      where.title = {
        [Op.iLike]: '%' + filter.term + '%'
      };
    }

    if (filter.locations && filter.locations.length > 0) {
      where.location = {
        [Op.in]: filter.locations
      };
    }

    return await DBEvent.findAll({
      where: where
    });
  }
}
