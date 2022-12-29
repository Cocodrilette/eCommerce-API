export default () => ({
  environment: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 5000,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresUsername: process.env.POSTGRES_USERNAME,
  postgresDbName: process.env.POSTGRES_NAME,
  postgresHost: process.env.POSTGRES_HOST,
  postgresPort: parseInt(process.env.POSTGRES_PORT, 10),
  defaultLimit: parseInt(process.env.DEFAULT_LIMIT, 10),
});
