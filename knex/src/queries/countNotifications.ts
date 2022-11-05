import { TaskNotificationEvent, Task } from 'models'
import { ref } from 'objection'

export const countNotifications = async ({ userId }: { userId: string }) => {
  const userTaskIds = await Task.query()
    .select('task.id')
    .join('taskAssignee', 'task.id', 'taskAssignee.taskId')
    .where('taskAssignee.userId', userId)

  return TaskNotificationEvent.query()
    .whereIn(
      'taskId',
      userTaskIds.map(({ id }) => id)
    )
    .where('userId', '!=', userId)
    .whereRaw(
      `
        (select created_at from task_seen_event where task_id = :taskId and user_id = :userId limit 1) IS NULL
        OR
        created_at > (select created_at from task_seen_event where task_id = :taskId and user_id = :userId order by created_at desc limit 1)
      `,
      {
        userId,
        taskId: ref('taskId'),
      }
    )
    .resultSize()
}
