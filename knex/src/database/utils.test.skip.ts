import knexCleaner from 'knex-cleaner'
import path from 'path'
import { initDatabase } from '.'
import './env'

export const knex = initDatabase()

export const destroyPool = () =>
  knex.destroy(() => console.info('DB pool is destroyed'))

export const cleanDatabase = () =>
  // @ts-ignore
  knexCleaner.clean(knex, {
    ignoreTables: [
      // These tables could be default: https://github.com/steven-ferguson/knex-cleaner/issues/13
      'knex_migrations',
      'knex_migrations_lock',
    ],
  })

export const cleanAndSeedDatabase = async () => {
  await cleanDatabase()

  const cwd = process.cwd()
  process.chdir(path.join(__dirname, '.'))

  await knex.seed.run()

  process.chdir(cwd)
}
