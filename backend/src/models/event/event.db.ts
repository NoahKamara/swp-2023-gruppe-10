import { CreationOptional, Op, WhereOptions, col, fn } from 'sequelize';
import { Column, Table, Model, HasMany, BelongsToMany} from 'sequelize-typescript';
import { Event, EventListItem, EventFilter } from 'softwareproject-common';
import { EventFactory } from './event.factory';
import { EventInterface } from './event.interface';
import { DBFavorites } from '../db.favorites';
import { DBUser } from '../user/user';

export interface PublicEvent extends Event{
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
  static async filterUpcoming(filter: EventFilter,user_id: number): Promise<PublicEvent[]> {
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

    const events = await DBEvent.findAll({
      include: {
        model: DBUser,
        on: {
          id: user_id,
        }
      },
      /*attributes: {
        include: [[fn('count',col('favorites')),'favCount']]
      } 
      */
    });
    // const events = await DBEvent.findAll();
    console.log(events[0]);
    return events.map( item => {
    //console.log(event.favoritedUsers);
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