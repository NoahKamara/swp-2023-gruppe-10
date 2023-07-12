import { CreationOptional, Op } from 'sequelize';
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

  /**
    * looks for a location with this name and returns it
    *
    * @memberof DBLocation
    * @static
    * @method
    * @param {string} name
    * @return {DBLocation | null}
    */
  static async lookup(name: string): Promise<DBLocation | null> {
    return await DBLocation.findOne({
      where: {
        name: {
          [Op.iLike]: name
        }
      }
    });
  }

  @HasMany(() => DBReview)
  reviews!: DBReview[] | null;
}
