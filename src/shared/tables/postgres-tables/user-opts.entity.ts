import { AutoIncrement, Column, CreatedAt, DeletedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, BelongsToMany, BelongsTo, ForeignKey, Unique } from 'sequelize-typescript';
import { User } from './user.entity';
import { UserOTPModel } from '../../../common/utils/model.constants';

@Table({
    tableName: UserOTPModel,
    paranoid: true
})
export class UserOTP extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => User)
    @Unique
    @Column
    declare userId: number
    
    @BelongsTo(() => User, { onDelete: 'CASCADE', hooks: true, foreignKey: 'userId'})
    declare user: User

    @Column
    declare otp: string;

    @Column
    declare expiresAt: Date;

    @CreatedAt
    @Column
    declare createdAt: Date;

    @UpdatedAt
    @Column
    declare updatedAt: Date;
}