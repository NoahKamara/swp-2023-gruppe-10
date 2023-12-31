import { CreationOptional, Op, col, fn } from 'sequelize';
import { Column, Table, Model, HasMany, Sequelize } from 'sequelize-typescript';
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
      subQuery: false,
      include: [
        {
          model: DBReview,
          as: 'reviews',
          attributes: [],
        },
      ],
      attributes: {
        include: [[fn('avg', col('reviews.stars')), 'average_rating']],
      },
      where: {
        name: {
          [Op.iLike]: name
        }
      },
      group: ['locations.name']
    });
  }

  static async lookup2(name: string): Promise<unknown> {
    const result = await DBLocation.findOne({
      subQuery: false,
      include: [
        {
          model: DBReview,
          as: 'reviews',
          attributes: [],
        },
      ],
      attributes: [
        [Sequelize.fn('avg', Sequelize.col('reviews.stars')), 'average_rating'],
      ],
      where: {
        name: {
          [Op.iLike]: name,
        },
      },
      group: ['locations.name'],
    });

    const averageRating = result?.get('average_rating');
    return averageRating;
  
  }

  @HasMany(() => DBReview)
  reviews!: DBReview[];
}
