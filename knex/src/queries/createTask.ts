import { Task, TaskAction, TaskActionKind } from 'models'

export const createTask = ({
  userId,
  assignees,
  ...input
}: {
  title: string
  dueAt: string
  assignees: string[]
  userId: string
}) =>
  Task.transaction(async (trx) => {
    const task = await Task.query(trx)
      .insertGraphAndFetch(
        {
          ...input,
          assignees: assignees.map((id) => ({ id })),
        },
        { relate: true }
      )
      .returning('*')

    await TaskAction.query(trx).insert({
      kind: TaskActionKind.Opened,
      taskId: task.id,
      userId: userId,
    })

    return task
  })
