// Централизованное чтение переменных окружения с дефолтами.
// Чтобы .env из корня работал в контейнере, compose уже пробрасывает ENV.
import dotenv from 'dotenv';

dotenv.config();

export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_PORT: Number(process.env.APP_PORT || 3000),

    DB_HOST: process.env.DB_HOST || 'db_service',
    DB_USER: process.env.DB_USER || 'renter_admin',
    DB_PASSWORD: process.env.DB_PASSWORD || 'secret',
    DB_NAME: process.env.DB_NAME || 'db',

    // Внешние API (пока опциональные, можно оставить пустыми)
    CLORE_API_KEY: process.env.CLORE_API_KEY || '',
    HIVEOS_API_KEY: process.env.HIVEOS_API_KEY || '',
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
    GITHUB_REPO: process.env.GITHUB_REPO || '' // user/repo
};