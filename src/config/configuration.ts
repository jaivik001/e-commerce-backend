export const configuration = () => ({
    NODE_ENV: global.env.NODE_ENV?.trim() || process.env.NODE_ENV?.trim(),
    PORT: parseInt(global.env.PORT, 10) || 3000,
    FRONTEND_URL: global.env.FRONTEND_URL,
    GOOGLE_CLIENT_ID: global.env.GOOGLE_CLIENT_ID,
    SERVER_API_KEY: global.env.SERVER_API_KEY,
    POSTGRES: {
        DB_NAME: global.env.POSTGRES_DB_NAME,
        DB_HOST: global.env.POSTGRES_DB_HOST,
        DB_PORT: global.env.POSTGRES_DB_PORT,
        USERNAME: global.env.POSTGRES_DB_USERNAME,
        PASSWORD: global.env.POSTGRES_DB_PASSWORD,
    },
    JWT: {
        KEY: global.env.JWT_SECRET_KEY,
        EXPIRES_IN: global.env.JWT_EXPIRES_IN,
        ISSUER: global.env.JWT_ISSUER,
        AUDIENCE: global.env.JWT_AUDIENCE,
        ALGORITHM: global.env.JWT_ALGORITHM,
    },
    ENCRYPTION_DECRYPTION: {
        ALGORITHM: global.env.ENCRYPTION_DECRYPTION_ALGORITHM,
        KEY: global.env.ENCRYPTION_DECRYPTION_KEY,
        ENCRYPT: global.env.ENCRYPT
    }
});
