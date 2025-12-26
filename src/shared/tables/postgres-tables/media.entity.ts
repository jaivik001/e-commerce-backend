import { AutoIncrement, BelongsTo, Column, CreatedAt, DeletedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt, HasOne, Index } from 'sequelize-typescript';
import { MediaModel } from '../../../common/utils/model.constants';
import { User } from './user.entity';

@Table({
    tableName: MediaModel,
    paranoid: true
})
export class Media extends Model {

    @PrimaryKey
    @AutoIncrement
    @Index
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({
        allowNull: false
    })
    declare originalName: string;

    @Column({
        allowNull: false
    })
    declare fileName: string

    @Column({
        allowNull: false
    })
    declare destination: string

    @Column({
        allowNull: false
    })
    declare extension: string

    @Column
    declare mimeType: string

    @Column({
        allowNull: false
    })
    declare path: string

    @Column({
        allowNull: false,
        type: DataType.BIGINT,
    })
    declare size: number

    @Column
    declare thumbnailPath: string

    @Column
    declare duration: string

    @Column
    declare height: number

    @Column
    declare width: number

    @Column
    declare ratio: number

    @Column
    declare mediaSeconds: number

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