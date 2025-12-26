import { AutoIncrement, BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from './user.entity';
import { Category } from './category.entity';
import { SubCategory } from './sub-category.entity';
import { ProductImage } from './product-image.entity';
import { ProductModel } from 'src/common/utils/model.constants';
import { Status } from 'src/common/utils/enums/status.enum';

@Table({
    tableName: ProductModel,
    paranoid: true
})
export class Product extends Model {

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
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    declare price: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare sku: string;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    declare stock: number;

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare categoryId: number;

    @BelongsTo(() => Category, { onDelete: 'CASCADE', hooks: true, foreignKey: 'categoryId' })
    declare category: Category;

    @ForeignKey(() => SubCategory)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare subCategoryId: number;

    @BelongsTo(() => SubCategory, { onDelete: 'SET NULL', hooks: true, foreignKey: 'subCategoryId' })
    declare subCategory: SubCategory;

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

    @HasMany(() => ProductImage)
    declare productImages: ProductImage[];

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