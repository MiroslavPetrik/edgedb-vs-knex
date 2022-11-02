import { Knex } from 'knex'

export const addPrimaryKey = ({
  knex,
  table,
}: {
  table: Knex.CreateTableBuilder | Knex.AlterTableBuilder
  knex: Knex
}) => {
  table
    .uuid('id')
    .notNullable()
    .primary()
    .defaultTo(knex.raw('uuid_generate_v4()'))
}
