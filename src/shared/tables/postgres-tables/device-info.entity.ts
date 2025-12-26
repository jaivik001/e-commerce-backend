import { Table, Column, DataType, PrimaryKey, AutoIncrement, Model, UpdatedAt, CreatedAt, ForeignKey, BelongsTo, DeletedAt, Unique } from 'sequelize-typescript';
import { DeviceInfoModel } from 'src/common/utils/model.constants';
import { User } from './user.entity';
import { DevicePlatform, Status } from 'src/common/utils/enums/status.enum';
import { DefaultAppVersion } from 'src/common/utils/constants';


@Table({
    tableName: DeviceInfoModel
})
export class DeviceInfo extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: Status.NO,
    })
    declare isLogin: number;

    @ForeignKey(() => User)
    @Unique
    @Column({
        allowNull: false
    })
    declare userId: number;

    @BelongsTo(() => User, { onDelete: 'CASCADE', hooks: true, foreignKey: 'userId' })
    declare user: User[];

    @Column({
        type: DataType.ENUM(DevicePlatform.ANDROID, DevicePlatform.IOS, DevicePlatform.WEB),
        allowNull: false,
    })
    declare devicePlatform: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare deviceToken: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare deviceUniqueId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare deviceModel: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare os: string;

    @Column({
        type: DataType.STRING,
    })
    declare accessToken: string;

    @Column({
        type: DataType.STRING,
        defaultValue: DefaultAppVersion
    })
    declare appVersion: string;

    @DeletedAt
    @Column
    declare deletedAt: Date;

    @CreatedAt
    @Column
    declare createdAt: Date;

    @UpdatedAt
    @Column
    declare updatedAt: Date;
}
