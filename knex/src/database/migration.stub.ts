import { Knex } from 'knex'
import { addTimestampColumns } from '../timestamps/migration'
import { addPrimaryKey } from '../uuid-oosp/migration'

export async function up(knex: Knex) {}

export async function down(knex: Knex) {}
