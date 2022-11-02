import { Knex } from 'knex'
import { addTimestampColumns } from '../timestamps'
import { addPrimaryKey } from '../uuid-oosp/migration'

export async function up(knex: Knex) {
  await knex.schema.createTable('user', (table) => {
    addPrimaryKey({ knex, table })
    table.string('givenName').notNullable()
    table.string('familyName').notNullable()
    addTimestampColumns({ knex, table })
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('user')
}
