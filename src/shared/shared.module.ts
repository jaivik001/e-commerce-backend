import { Module } from '@nestjs/common';
import { PostgresqlDatabaseModule } from './database/postgresql-database.module';
import { PostgresqlTablesModule } from './tables/postgres-tables.module';

@Module({
    imports: [
        PostgresqlDatabaseModule,
        PostgresqlTablesModule
    ],
    exports:[PostgresqlDatabaseModule, PostgresqlTablesModule]
})
export class SharedModule {}
