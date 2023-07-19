const env = process.env.NODE_ENV;
const database = process.env.DB_NAME;
const logging = env === 'test' ? false : console.log;
const max_connections = process.env.DB_MAX_CONNECTIONS || 100;
const idle = process.env.DB_CONNECTION_IDLE || 100;
const evict = process.env.DB_CONNECTION_EVICT || 110;

const config = {
  env,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: database,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: logging,
  pool: {
    max: max_connections,
    min: 0,
    idle,
    evict
  },
  seederStorage: 'sequelize',
  JWT_SECRET: process.env.JWT_SECRET,
  AMPQ_HOST: process.env.AMPQ_HOST || 'amqp://host.docker.internal',
  AMPQ_QUEUE: process.env.AMPQ_QUEUE || 'ECOMMERCE',
  PRODUCT_SERVICE: 'PRODUCT_SERVICE',
  USER_SERVICE: 'USER_SERVICE',
  ORDER_SERVICE: 'ORDER_SERVICE'
};

module.exports = config;
