import { Knex } from 'knex'
import { addTimestampColumns } from '../timestamps'
import { addPrimaryKey } from '../uuid-oosp/migration'
import { TaskActionKind } from '../../models/TaskAction'

const addTaskEventColumns = ({
  knex,
  table,
}: {
  table: Knex.CreateTableBuilder | Knex.AlterTableBuilder
  knex: Knex
}) => {
  addPrimaryKey({ knex, table })
  table.uuid('taskId').notNullable()
  table
    .foreign('taskId')
    .references('id')
    .inTable('task')
    .onDelete('CASCADE')
    .onUpdate('CASCADE')
  table.uuid('userId').notNullable()
  table
    .foreign('userId')
    .references('id')
    .inTable('user')
    .onDelete('CASCADE')
    .onUpdate('CASCADE')
  addTimestampColumns({ knex, table })
}

export async function up(knex: Knex) {
  await knex.schema.createTable('task', (table) => {
    addPrimaryKey({ knex, table })
    table.string('title').notNullable()
    table.timestamp('dueAt').notNullable()
    addTimestampColumns({ knex, table })
  })

  await knex.schema.createTable('taskAssignee', (table) => {
    table.uuid('taskId').notNullable()
    table
      .foreign('taskId')
      .references('id')
      .inTable('task')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    table.uuid('userId').notNullable()
    table
      .foreign('userId')
      .references('id')
      .inTable('user')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    table.primary(['taskId', 'userId'])
  })

  await knex.schema.createTable('taskSeenEvent', (table) => {
    addTaskEventColumns({ knex, table })
  })

  await knex.schema.createTable('taskAction', (table) => {
    addTaskEventColumns({ knex, table })

    table.enu('kind', Object.values(TaskActionKind), {
      useNative: true,
      enumName: 'TaskActionKind',
    })
  })

  await knex.schema.createTable('taskComment', (table) => {
    addTaskEventColumns({ knex, table })
    table.text('note')
  })

  await knex.schema.createView('taskNotificationEvent', (viewBuilder) => {
    viewBuilder.as(
      knex('taskAction')
        .select(['taskId', 'userId', 'createdAt'])
        .unionAll(knex('taskComment').select(['taskId', 'userId', 'createdAt']))
    )
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropViewIfExists('taskNotificationEvent')
  await knex.schema.dropTableIfExists('taskComment')
  await knex.schema.dropTableIfExists('taskAction')
  await knex.schema.raw('DROP TYPE IF EXISTS "TaskActionKind"')
  await knex.schema.dropTableIfExists('taskSeenEvent')
  await knex.schema.dropTableIfExists('taskAssignee')
  await knex.schema.dropTableIfExists('task')
}
