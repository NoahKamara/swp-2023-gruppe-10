import { CreationOptional } from 'sequelize';
import { Table, Model, ForeignKey, BelongsTo, Column, PrimaryKey, HasMany } from 'sequelize-typescript';
import { DBUser } from './user/user';
import { DBLocation } from './db.location';
import { PublicReview } from 'softwareproject-common';
import { randomInt } from 'crypto';
import { DBReview } from './db.review';


@Table({ modelName: 'helpful', timestamps: false })
export class DBHelpful extends Model {
  declare id: CreationOptional<number>;

  @PrimaryKey
  @ForeignKey(() => DBUser)
  @Column
  user_id!: number;

  @PrimaryKey
  @ForeignKey(() => DBReview)
  @Column
  rev_id!: number;

  @BelongsTo(() => DBReview, 'rev_id')
  location!: DBReview;

  @BelongsTo(() => DBUser, 'user_id')
  user!: DBUser;

  // MARK: HasMany for helpful
  // @HasMany(() => DBHelpful)
  // helpful!: DBHelpful[]
  






  // @Column
  // amount!: number;
}