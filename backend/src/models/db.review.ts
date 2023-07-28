import { CreationOptional, Op } from 'sequelize';
import { BelongsTo, Column, ForeignKey, HasMany, Model, Sequelize, Table } from 'sequelize-typescript';
import { PublicReview } from 'softwareproject-common';
import { DBHelpful } from './db.helpful';
import { DBLocation } from './db.location';
import { DBUser } from './user/user';


@Table({ modelName: 'reviews', timestamps: false })
export class DBReview extends Model {
  declare id: CreationOptional<number>;

  @ForeignKey(() => DBUser)
  @Column
  user_id!: number;

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
  helpfuls!: DBHelpful[];


  @Column
  title!: string;

  @Column
  comment!: string;


  public get public(): PublicReview {
    console.log('ID', this.id);
    return {
      id: this.id,
      name: this.user.firstName + ' ' + this.user.lastName[0] + '.',
      title: this.title,
      comment: this.comment,
      stars: this.stars,
      helpful: this.helpfuls.length
    };
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

