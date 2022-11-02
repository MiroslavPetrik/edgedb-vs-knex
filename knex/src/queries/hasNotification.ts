import { TaskNotificationEvent, TaskSeenEvent } from 'models'

export const hasNotification = async ({
  taskId,
  userId,
}: {
  taskId: string
  userId: string
}) => {
  const lastSeenEvent = await TaskSeenEvent.query()
    .select('createdAt')
    .where({ taskId, userId })
    .orderBy('createdAt', 'desc')
    .first()

  const notificationEventQuery = TaskNotificationEvent.query()
    .where({ taskId })
    .where('userId', '!=', userId)

  if (lastSeenEvent) {
    void notificationEventQuery.where('createdAt', '>', lastSeenEvent.createdAt)
  }

  return (await notificationEventQuery.resultSize()) > 0
}
