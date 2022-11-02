import e from '../../edgedb/builder'
import { client } from '../../edgedb/client'

/**
 * Here is attempt to separate the inserts from `createTask.inner.task.insert`
 * and select both insert results in explicit select.
 *
 * The nice property of EQL is the composability of statements,
 * but it fails short in a case where the nested query uses params.
 *
 * Maybe the compiler could be smart enough to 'hoist & propagate' the params.
 */
const task = e.params(
  { title: e.str, dueAt: e.datetime, assignees: e.array(e.uuid) },
  ({ assignees, ...params }) =>
    e.insert(e.Task, {
      ...params,
      assignees: e.select(e.User, (u) => ({
        filter: e.op(u.id, 'in', e.array_unpack(assignees)),
      })),
    })
)

const openAction = e.insert(e.TaskAction, {
  kind: e.TaskActionKind.Opened,
  user: e.global.currentUser,
  task,
})

// ERR: Fails with 'withParams' does not support being used as a nested expression
const selectBoth = e.select({ task, openAction })

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
  // @ts-ignore
  selectBoth.run(client.withGlobals({ currentUserId: userId }), {
    title,
    dueAt,
    assignees,
  })
