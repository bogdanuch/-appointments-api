import * as process from 'process';

export const loadEnv = () => ({
  db: {
    dialect: process.env.DB_DIALECT || '',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || '',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
  },
  encryption: {
    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
  },
  jwt: {
    secret: Buffer.from(process.env.JWT_SECRET ?? '', 'hex'),
    refresh_secret: Buffer.from(process.env.JWT_REFRESH_SECRET ?? '', 'hex'),
  },
});
