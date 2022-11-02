import { Knex } from 'knex'
import { timestampPlugin } from 'objection-timestamps'

export const withTimestamps = timestampPlugin()

export const addTimestampColumns = ({
  knex,
  table,
}: {
  table: Knex.CreateTableBuilder | Knex.AlterTableBuilder
  knex: Knex
}) => {
  table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())
  table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())
}
