const { join } = require('path');
const secureEnv = require('secure-env');
const envPath = join(__dirname, '../../config/env/', `${process.env.NODE_ENV}.env.enc`)
console.log(envPath)
global.env = secureEnv({ secret: 'ECfgfdh9l36m67lf50HFGT2fy8b6a44', path: envPath });


module.exports = {
  development: {
    username: global.env.POSTGRES_DB_USERNAME,
    password: global.env.POSTGRES_DB_PASSWORD,
    database: global.env.POSTGRES_DB_NAME,
    host: global.env.POSTGRES_DB_HOST,
    port: global.env.POSTGRES_DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    },
    seederStorage: "sequelize",
    seederStorageTableName: "seeder_migration"
  },
  staging: {
    username: global.env.POSTGRES_DB_USERNAME,
    password: global.env.POSTGRES_DB_PASSWORD,
    database: global.env.POSTGRES_DB_NAME,
    host: global.env.POSTGRES_DB_HOST,
    port: global.env.POSTGRES_DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    },
    seederStorage: "sequelize",
    seederStorageTableName: "seeder_migration"
  },
  production: {
    username: global.env.POSTGRES_DB_USERNAME,
    password: global.env.POSTGRES_DB_PASSWORD,
    database: global.env.POSTGRES_DB_NAME,
    host: global.env.POSTGRES_DB_HOST,
    port: global.env.POSTGRES_DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    },
    seederStorage: "sequelize",
    seederStorageTableName: "seeder_migration"
  }
};
