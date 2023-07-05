import { CreationOptional } from 'sequelize';
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

}
