import { AutoIncrement, Column, CreatedAt, DeletedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, BelongsToMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity';
import { RoleModel } from '../../../common/utils/model.constants';

@Table({
    tableName: RoleModel,
    paranoid: true
})
export class Role extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column
    declare name: string;

    @Column
    declare slug: string;

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
}