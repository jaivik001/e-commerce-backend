import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './postgres-tables/user.entity';
import { Role } from './postgres-tables/role.entity';
import { Media } from './postgres-tables/media.entity';
import { Category } from './postgres-tables/category.entity';
import { SubCategory } from './postgres-tables/sub-category.entity';
import { Product } from './postgres-tables/product.entity';
import { ProductImage } from './postgres-tables/product-image.entity';
import { DeviceInfo } from './postgres-tables/device-info.entity';
import { UserOTP } from './postgres-tables/user-opts.entity';

@Module({
    imports: [
        SequelizeModule.forFeature([
            User,
            Role,
            Media,
            DeviceInfo,
            UserOTP,
            Category,
            SubCategory,
            Product,
            ProductImage
        ])
    ],
    exports:[SequelizeModule]
})
export class PostgresqlTablesModule {}
