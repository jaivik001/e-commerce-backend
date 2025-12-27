import { AutoIncrement, BelongsTo, Index, Column, CreatedAt, DeletedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt, HasMany, BelongsToMany, HasOne, AfterCreate, AfterDestroy, BeforeDestroy, Unique } from 'sequelize-typescript';
import { Role } from './role.entity';
import { UserModel } from '../../../common/utils/model.constants';
import { Media } from './media.entity';
import { AuthProvider, Status } from '../../../common/utils/enums/status.enum';
import { DeviceInfo } from './device-info.entity';


@Table({
    tableName: UserModel,
    paranoid: true
})
export class User extends Model {

    @PrimaryKey
    @AutoIncrement
    @Index
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({
        type: DataType.STRING,
    })
    declare name: string;

    @Column({
        type: DataType.STRING
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true, // Automatically creates a unique index
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare mobileNoCountryCode: string;

    @Column({
        type: DataType.STRING,
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare mobileNo: string;

    @Column({
        type: DataType.STRING,
    })
    declare password: string;

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER
    })
    declare roleId: number

    @BelongsTo(() => Role, { onDelete: 'CASCADE', hooks: true, foreignKey: 'roleId' })
    declare role: Role

    @ForeignKey(() => Media)
    @Column({
        type: DataType.INTEGER
    })
    declare avatarId: number

    @BelongsTo(() => Media, { onDelete: 'SET NULL', hooks: true, foreignKey: 'avatarId' })
    declare avatar: Media

    @Column({
        type: DataType.STRING
    })
    declare passwordResetToken: string;

    @Column({
        type: DataType.DATE
    })
    declare passwordResetTokenExpiry: Date;

    @Column({
        type: DataType.ENUM(AuthProvider.GOOGLE, AuthProvider.MANUAL), 
        defaultValue: AuthProvider.MANUAL,
        allowNull: false,   
    })
    declare authProvider: string;

    @Column({
        defaultValue: Status.YES,
    })
    declare isActive: number;

    @Column({
        defaultValue: Status.YES,
    })
    declare isEmailVerified: number;

    @ForeignKey(() => User)
    @Column
    declare createdByUserId: number;

    @BelongsTo(() => User, { onDelete: 'SET NULL', hooks: true, foreignKey: 'createdByUserId' })
    declare createdBy: User

    @ForeignKey(() => User)
    @Column
    declare updatedByUserId: number;

    @BelongsTo(() => User, { onDelete: 'SET NULL', hooks: true, foreignKey: 'updatedByUserId' })
    declare updatedBy: User

    @ForeignKey(() => User)
    @Column
    declare deletedByUserId: number;

    @BelongsTo(() => User, { onDelete: 'SET NULL', hooks: true, foreignKey: 'deletedByUserId' })
    declare deletedBy: User

    @DeletedAt
    @Column
    declare deletedAt: Date;

    @CreatedAt
    @Column
    declare createdAt: Date;

    @UpdatedAt
    @Column
    declare updatedAt: Date;

    @HasOne(() => DeviceInfo)
    declare deviceInfo: DeviceInfo

}