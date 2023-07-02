import { CreationOptional, Op } from 'sequelize';
import { Column, Table, Model } from 'sequelize-typescript';
import { Event, EventListItem } from 'softwareproject-common';




@Table({ modelName: 'events', timestamps: false })
export class DBEvent extends Model<Event> {
  declare id: CreationOptional<number>;

  @Column
  title!: string;

  @Column
  start_date!: Date;

  @Column
  end_date!: Date;

  @Column
  location!: Date;

  @Column
  picture!: string;

  @Column
  price!: number;

  @Column
  description!: string;

  @Column
  description_html!: string;


  makeListItem(): EventListItem {
    return {
      id: this.id,
      title: this.title,
      picture: this.picture,
      start_date: this.start_date,
      end_date: this.end_date,
      price: this.price
    };
  }

  /**
    * Searches for upcoming events
    *
    * @memberof DBEvent
    * @static
    * @method
    * @param {string} term - Search ter
    * @return {DBEvent[]} - search results
    */
  static async search(term: string): Promise<DBEvent[]> {
    return await DBEvent.findAll({
      where: {
        start_date: {
          [Op.gte]: Date.now()
        },
        title: {
          [Op.iLike]: '%' + term + '%'
        },
      }
    });
  }

  /**
    * returns upcoming events
    *
    * @memberof DBEvent
    * @static
    * @method
    * @return {DBEvent[]} - search results
    */
  static async upcoming(): Promise<DBEvent[]> {
    return await DBEvent.findAll({
      where: {
        start_date: {
          [Op.gte]: Date.now()
        }
      },
      order: [
        ['start_date', 'ASC'],
        ['end_date', 'DESC']
      ]
    });
  }
}
