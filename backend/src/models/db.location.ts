import { CreationOptional } from 'sequelize';
import { Column, Table, Model, HasMany } from 'sequelize-typescript';
import { Location } from 'softwareproject-common';
import { DBReview } from './db.review';




@Table({ modelName: 'locations', timestamps: false })
export class DBLocation extends Model<Location> {
  declare id: CreationOptional<number>;

  @Column
  name!: string;

  @Column
  coordinates_lat!: number;

  @Column
  coordinates_lng!: number;

  @Column
  picture!: string;

  @Column
  description!: string;

  @Column
  description_html!: string;

  @HasMany(() => DBReview)
  reviews!: DBReview[] | null;
}
