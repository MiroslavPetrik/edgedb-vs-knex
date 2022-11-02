import { knexSnakeCaseMappers } from 'objection'

export const getKnexConfig = () => ({
  client: 'pg',
  connection: process.env.POSTGRES_CONNECTION_STRING,
  seeds: {
    timestampFilenamePrefix: true,
  },
  max: 50,
  connectionTimeoutMillis: 1000,
  idleTimeoutMillis: 1000,
  migrations: {
    stub: 'migration.stub.ts',
  },
  ...knexSnakeCaseMappers(),
})
