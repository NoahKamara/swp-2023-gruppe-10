import { CreationOptional, Op, WhereOptions, col, fn } from 'sequelize';
import { Column, Table, Model, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Event, EventListItem, EventFilter } from 'softwareproject-common';
import { EventFactory } from './event.factory';
import { EventInterface } from './event.interface';
import { DBFavorites } from '../db.favorites';
import { DBUser } from '../user/user';
import { boolean } from 'zod';
import { start } from 'repl';

export interface PublicEvent extends Event {
  isFavorite: boolean;

}



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

  @BelongsToMany(() => DBUser, () => DBFavorites)
  favoritedUsers!: DBUser[];





  /**
   * Implements EventFactory.filterUpcoming
   */
  static async filterUpcoming(filter: EventFilter, user_id: number): Promise<PublicEvent[]> {
    console.log('FILTER', filter);
    const where: WhereOptions<DBEvent> = {
      // start_date: {
      //   [Op.gte]: filter.endDate
      // }
    };

    // event.term matches term
    if (filter.term) {
      where.title = {
        [Op.iLike]: '%' + filter.term + '%'
      };
    }

    // event.location contained in locations
    if (filter.locations && filter.locations.length > 0) {
      where.location = {
        [Op.in]: filter.locations
      };
    }

    // event.price <= Max Price
    if (filter.maxPrice) {
      where.price = {
        [Op.lte]: filter.maxPrice
      };
    }

    // event.price >= Min Price
    if (filter.minPrice) {
      where.price = {
        [Op.gte]: filter.minPrice
      };
    }

    /**
     * Date Filter
     */

     // event.start_date <= end date
     if (filter.endDate) {
      where.start_date = {
        [Op.lte]: filter.endDate
      };
    }

    // event.end_date <= start date
    if (filter.startDate) {
      where.end_date = {
        [Op.gte]: filter.startDate
      };
    }

    const events = await DBEvent.findAll({
      include: {
        model: DBUser,
        on: {
          id: user_id,
        }
      },
      where: where
    });
    // const events = await DBEvent.findAll();

    console.log(filter);
    const filtered = events.filter(event => {
        if (event.end_date > (filter.startDate ?? Date())) {
          return false;
        }

        if (filter.endDate && event.start_date < filter.endDate) {
          return false;
        }
        return true;
      });

      console.log(filtered.length);

      return filtered.map(item => {
        return {
          id: item.id,
          title: item.title,
          picture: item.picture,
          start_date: item.start_date,
          end_date: item.end_date,
          start_time: item.start_time,
          end_time: item.end_time,
          price: item.price,
          location: item.location,
          description: item.description,
          description_html: item.description_html,
          isFavorite: item.favoritedUsers.length === 0,
      };

    }
    );

}
}
