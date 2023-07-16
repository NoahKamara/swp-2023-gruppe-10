import { CreationOptional } from 'sequelize';
import { Table, Model, ForeignKey, BelongsTo, Column, PrimaryKey, HasMany } from 'sequelize-typescript';
import { DBUser } from './user/user';
import { DBLocation } from './db.location';
import { PublicReview } from 'softwareproject-common';
import { randomInt } from 'crypto';
import { DBHelpful } from './db.helpful';


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



  // @HasMany(() => DBHelpful)
  // helpful!: DBHelpful[]
  
  helpful = 0;

  @Column
  title!: string;

  @Column
  comment!: string;

  public get public(): PublicReview {
    return {
      
      name: this.user.firstName + ' ' + this.user.lastName[0] + '.',
      title: this.title,
      comment: this.comment,
      stars: this.stars,
      // FIXME: helpful subquery
      
     
      helpful: randomInt(0, 100)
    };
  }






  // @Column
  // amount!: number;
}
