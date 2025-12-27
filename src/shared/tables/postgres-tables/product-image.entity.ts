import { AutoIncrement, BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Media } from './media.entity';
import { ProductImageModel } from 'src/common/utils/model.constants';
import { Status } from 'src/common/utils/enums/status.enum';

@Table({
    tableName: ProductImageModel,
    paranoid: true
})
export class ProductImage extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare productId: number;

    @BelongsTo(() => Product, { onDelete: 'CASCADE', hooks: true, foreignKey: 'productId' })
    declare product: Product;

    @ForeignKey(() => Media)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare mediaId: number;

    @BelongsTo(() => Media, { onDelete: 'CASCADE', hooks: true, foreignKey: 'mediaId' })
    declare media: Media;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    declare sortOrder: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare isPrimary: boolean;

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