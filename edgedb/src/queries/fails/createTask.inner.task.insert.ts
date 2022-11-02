import e from '../../edgedb/builder'
import { client } from '../../edgedb/client'

/**
 * This has problem that it returns the TaskAction.id (parent insert)
 * while we need to use the Task.id from the inner insert.
 * => Nested query is not always a win.
 *
 * Maybe we could have API like `.withSelect(() => ({ task: true }))`
 * which would mimick the `withGraphFetched` from the knex.
 */
const createTaskQuery = e.params(
  { title: e.str, dueAt: e.datetime, assignees: e.array(e.uuid) },
  ({ assignees, ...params }) =>
    e.insert(e.TaskAction, {
      kind: e.TaskActionKind.Opened,
      user: e.global.currentUser,
      task: e.insert(e.Task, {
        ...params,
        assignees: e.select(e.User, (u) => ({
          filter: e.op(u.id, 'in', e.array_unpack(assignees)),
        })),
      }),
    })
)

export const createTask = ({
  userId,
  title,
  dueAt,
  assignees,
}: {
  userId: string
  title: string
  dueAt: Date
  assignees: string[]
}) =>
  createTaskQuery.run(client.withGlobals({ currentUserId: userId }), {
    title,
    dueAt,
    assignees,
  })
