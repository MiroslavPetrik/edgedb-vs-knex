import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.raw('CREATE extension IF NOT EXISTS "uuid-ossp";')
}

export async function down(knex: Knex) {
  await knex.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp";')
}
