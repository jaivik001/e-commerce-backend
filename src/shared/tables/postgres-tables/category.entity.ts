import { AutoIncrement, BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from './user.entity';
import { CategoryModel } from 'src/common/utils/model.constants';
import { Status } from 'src/common/utils/enums/status.enum';
import { SubCategory } from './sub-category.entity';

@Table({
    tableName: CategoryModel,
    paranoid: true
})
export class Category extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare desc: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare slug: string;

    @Column({
        defaultValue: Status.YES,
    })
    declare isActive: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
    })
    declare createdByUserId: number;

    @BelongsTo(() => User, { onDelete: 'SET NULL', hooks: true, foreignKey: 'createdByUserId' })
    declare createdBy: User;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
    })
    declare updatedByUserId: number;

    @BelongsTo(() => User, { onDelete: 'SET NULL', hooks: true, foreignKey: 'updatedByUserId' })
    declare updatedBy: User;

    @HasMany(() => SubCategory)
    declare subCategories: SubCategory[]

    @CreatedAt
    @Column({
        defaultValue: DataType.NOW,
    })
    declare createdAt: Date;

    @UpdatedAt
    @Column({
        defaultValue: DataType.NOW,
    })
    declare updatedAt: Date;

    @DeletedAt
    @Column
    declare deletedAt: Date;
}