import { CreationOptional } from 'sequelize';
import { Table, Model, ForeignKey, BelongsTo, Column, PrimaryKey } from 'sequelize-typescript';
import { DBUser } from './user/user';
import { DBReview } from './db.review';


@Table({ modelName: 'helpfuls', timestamps: false })
export class DBHelpful extends Model {
  @ForeignKey(() => DBUser)
  @PrimaryKey
  @Column
  user_id!: number;

  @ForeignKey(() => DBReview)
  @PrimaryKey
  @Column
  rev_id!: number;

  @BelongsTo(() => DBReview, 'rev_id')
  review!: DBReview;

  @BelongsTo(() => DBUser, 'user_id')
  user!: DBUser;

  // @Column
  // amount!: number;
}
