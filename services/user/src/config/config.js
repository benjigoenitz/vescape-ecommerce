const env = process.env.NODE_ENV || 'development';
const database = process.env.DB_NAME || 'user_service_local_dev}';
const logging = env === 'test' ? false : console.log;
const max_connections = process.env.DB_MAX_CONNECTIONS || 100;
const idle = process.env.DB_CONNECTION_IDLE || 100;
const evict = process.env.DB_CONNECTION_EVICT || 110;

const config = {
  env,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: database,
  host: process.env.DB_HOST || 'vescape-ecommerce_user_db_1',
  port: process.env.DB_PORT || '5432',
  dialect: 'postgres',
  logging: logging,
  pool: {
    max: max_connections,
    min: 0,
    idle,
    evict
  },
  seederStorage: 'sequelize',
  JWT_SECRET: process.env.JWT_SECRET || 'secret'
};

module.exports = config;
