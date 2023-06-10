import { CreationOptional } from 'sequelize';
import { Column, Table, Model } from 'sequelize-typescript';
import { Location } from 'softwareproject-common';




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
}
