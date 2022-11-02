import e from '../edgedb/builder'
import { client } from '../edgedb/client'

const hasNotificationQuery = e.params({ id: e.uuid }, ({ id }) =>
  e.select(e.Task, () => ({
    hasNotification: true,
    filter_single: { id },
  }))
)

export const selectHasNotification = ({
  taskId,
  userId,
}: {
  taskId: string
  userId: string
}) =>
  hasNotificationQuery.run(client.withGlobals({ currentUserId: userId }), {
    id: taskId,
  })
