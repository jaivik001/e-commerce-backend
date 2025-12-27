import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../tables/postgres-tables/user.entity';
import { Role } from '../tables/postgres-tables/role.entity';
import { Media } from '../tables/postgres-tables/media.entity';
import { Product } from '../tables/postgres-tables/product.entity';
import { ProductImage } from '../tables/postgres-tables/product-image.entity';
import { Category } from '../tables/postgres-tables/category.entity';
import { SubCategory } from '../tables/postgres-tables/sub-category.entity';
import { DeviceInfo } from '../tables/postgres-tables/device-info.entity';
import { UserOTP } from '../tables/postgres-tables/user-opts.entity';


@Module({
    imports: [
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                dialect: 'postgres',
                host: configService.get<string>('POSTGRES.DB_HOST'),
                port: configService.get<number>('POSTGRES.DB_PORT'),
                username: configService.get<string>('POSTGRES.USERNAME'),
                password: configService.get<string>('POSTGRES.PASSWORD'),
                database: configService.get<string>('POSTGRES.DB_NAME'),
                autoLoadModels: true,
                synchronize: true,
                alter: true,
                // drop: false,
                models: [
                    User,
                    Role,
                    Media,
                    DeviceInfo,
                    UserOTP,
                    Category,
                    SubCategory,
                    Product,
                    ProductImage
                ],
            }),
        }),
    ],
})
export class PostgresqlDatabaseModule { }
