import { CreationOptional, Op } from 'sequelize';
import { Table, Model, ForeignKey, BelongsTo, Column, PrimaryKey, HasMany, Sequelize } from 'sequelize-typescript';
import { DBUser } from './user/user';
import { DBLocation } from './db.location';
import { PublicReview } from 'softwareproject-common';
import { randomInt } from 'crypto';
import { DBHelpful } from './db.helpful';
import { lookup } from 'dns';


@Table({ modelName: 'reviews', timestamps: false })
export class DBReview extends Model {
  declare id: CreationOptional<number>;

  @PrimaryKey
  @ForeignKey(() => DBUser)
  @Column
  user_id!: number;

  @PrimaryKey
  @ForeignKey(() => DBLocation)
  @Column
  location_id!: number;

  @BelongsTo(() => DBLocation, 'location_id')
  location!: DBLocation;

  @BelongsTo(() => DBUser, 'user_id')
  user!: DBUser;

  @Column
  stars!: number;



  @HasMany(() => DBHelpful)
   helpful!: DBHelpful[]


  @Column
  title!: string;

  @Column
  comment!: string;


  public get public(): PublicReview {
    return {
      id: this.id,

      name: this.user.firstName + ' ' + this.user.lastName[0] + '.',
      title: this.title,
      comment: this.comment,
      stars: this.stars,
      // FIXME: helpful subquery

      helpful: Number(DBReview.lookup2(this.id))


    }
  }

 
  static async lookup2(id: number): Promise<unknown> {
    const result = await DBHelpful.findOne({
      subQuery: false,

      attributes: [
        [Sequelize.fn('count', Sequelize.col('user_id')), 'count'],
      ],
      where: {
        rev_id: {
          [Op.iLike]: id,
        },
      },
    });

    const count = result?.get('count');
    return count;

  }

}

