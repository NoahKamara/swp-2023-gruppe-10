import { CreationOptional, Op, WhereOptions } from 'sequelize';
import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { Event, EventFilter } from 'softwareproject-common';
import { DBFavorites } from '../db.favorites';
import { DBUser } from '../user/user';
import { EventFactory } from './event.factory';
import { EventInterface } from './event.interface';

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
    const where: WhereOptions<DBEvent> = {};

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
    
    // if maxPrice and minPrice == 0 show nothing 
    if(filter.minPrice === 0 && filter.maxPrice === 0){
      where.price = {
        [Op.lte]: filter.minPrice
      };
    }

    // event.price <= Max Price
    if (filter.maxPrice) {
      where.price = {
        [Op.lte]: filter.maxPrice,
        [Op.gte]: filter.minPrice
      };
    }

    // event.price >= Min Price
    if (filter.minPrice) {
      where.price = {
        [Op.gte]: filter.minPrice,
        [Op.lte]: filter.maxPrice    
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
        [Op.gte]: filter.startDate,
      };
    }

    const events = await DBEvent.findAll({
      include: {
        model: DBUser,
        where: {
          id: user_id
        },
        required: false
      },
      where: where
    });
    // const events = await DBEvent.findAll();

    console.log(filter);
    const filtered = events.filter(event => {
      console.log('EVENT', event.title, event.favoritedUsers.length);
      if (filter.onlyFavorites === true && event.favoritedUsers.length === 0 ) {
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
