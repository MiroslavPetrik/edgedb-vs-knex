import e from '../../edgedb/builder'
import { client } from '../../edgedb/client'
import { TaskActionKind } from '../../../dbschema/interfaces'

const insertTaskActionQuery = e.params(
  { id: e.uuid, kind: e.TaskActionKind },
  ({ id, kind }) =>
    e.insert(e.TaskAction, {
      kind,
      user: e.global.currentUser,
      task: e.select(e.Task, () => ({ filter_single: { id } })),
    })
)

export const insertTaskAction = ({
  userId,
  taskId,
  kind,
}: {
  userId: string
  taskId: string
  kind: TaskActionKind
}) =>
  insertTaskActionQuery.run(client.withGlobals({ currentUserId: userId }), {
    id: taskId,
    kind,
  })
