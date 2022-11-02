import { addDays, addMonths, addYears } from 'date-fns'
import { Knex } from 'knex'
import { Model } from 'objection'
import { Task, TaskAction, TaskActionKind, User } from '../../models'

export const initSeeder = async () => {
  const [userA, userB] = await User.query()

  return [
    {
      title: 'Write a book',
      dueAt: addYears(new Date(), 1).toISOString(),
      assignees: [userA, userB],
    },
    {
      title: 'Ship project',
      dueAt: addMonths(new Date(), 3).toISOString(),
      assignees: [userA],
    },
    {
      title: 'Publish blog post',
      dueAt: addMonths(new Date(), 1).toISOString(),
      assignees: [userA, userB],
    },
    {
      title: 'Host a conference',
      dueAt: addYears(new Date(), 2).toISOString(),
      assignees: [userB],
    },
    {
      title: 'Fix bug',
      dueAt: addDays(new Date(), 5).toISOString(),
      assignees: [userB],
    },
  ]
}

export async function seed(knex: Knex) {
  Model.knex(knex)
  const tasks = await initSeeder()

  const dbTasks = await Task.query()
    .insertGraph(tasks, { relate: true })
    .returning('*')

  const [firstUser] = await User.query()

  // open all tasks
  await TaskAction.query().insert(
    dbTasks.map(({ id: taskId }) => ({
      taskId,
      kind: TaskActionKind.Opened,
      userId: firstUser.id,
    }))
  )

  // close some tasks
  await TaskAction.query().insert(
    dbTasks.slice(3).map(({ id: taskId }) => ({
      taskId,
      kind: TaskActionKind.Closed,
      userId: firstUser.id,
    }))
  )
}
