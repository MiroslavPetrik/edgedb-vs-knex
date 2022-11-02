import { Task, TaskAction, TaskActionKind } from '../models'
import { raw } from 'objection'

export enum TaskStatus {
  InProgress = 'InProgress',
  PastDue = 'PastDue',
  Completed = 'Completed',
}

export const selectTaskStatus = (task: Task): Promise<{ status: TaskStatus }> =>
  // @ts-ignore
  TaskAction.query()
    .select(
      raw(
        `
        CASE
        WHEN kind = :Opened AND :dueAt > NOW() THEN :InProgress
        WHEN kind = :Opened AND :dueAt <= NOW() THEN :PastDue
        ELSE :Completed END
        `,
        {
          dueAt: task.dueAt,
          Opened: TaskActionKind.Opened,
          InProgress: TaskStatus.InProgress,
          PastDue: TaskStatus.PastDue,
          Completed: TaskStatus.Completed,
        }
      ).as('status')
    )
    .where('taskId', task.id)
    .andWhere((builder) => {
      void builder.whereIn('kind', [
        TaskActionKind.Closed,
        TaskActionKind.Opened,
      ])
    })
    .orderBy('createdAt', 'desc')
    .first()
