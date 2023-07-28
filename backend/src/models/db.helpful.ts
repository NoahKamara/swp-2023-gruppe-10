import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { DBReview } from './db.review';
import { DBUser } from './user/user';


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
