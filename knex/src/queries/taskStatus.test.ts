import { TaskAction, TaskActionKind, User } from 'models'
import { selectTaskStatus, TaskStatus } from './taskStatus'
import { destroyPool } from '../database/utils.test.skip'
import { createTask } from './createTask'
import { addDays, subDays } from 'date-fns'

afterAll(() => {
  destroyPool()
})

describe('taskStatus', () => {
  let userA: User

  beforeAll(async () => {
    ;[userA] = await User.query().limit(1)
  })
  describe('with the due date in the future', () => {
    const makeInput = () => ({
      title: 'Test',
      dueAt: addDays(new Date(), 1).toISOString(),
      assignees: [userA.id],
      userId: userA.id,
    })

    it('equals InProgress when last action is Opened', async () => {
      const task = await createTask(makeInput())

      const { status } = await selectTaskStatus(task)

      expect(status).toBe(TaskStatus.InProgress)
    })

    it('equals InProgress when last action is Edited', async () => {
      const task = await createTask(makeInput())

      await TaskAction.query().insert({
        kind: TaskActionKind.Edited,
        taskId: task.id,
        userId: userA.id,
      })

      const { status } = await selectTaskStatus(task)

      expect(status).toBe(TaskStatus.InProgress)
    })

    it('equals Completed when last action is Closed', async () => {
      const task = await createTask(makeInput())

      await TaskAction.query().insert({
        kind: TaskActionKind.Closed,
        taskId: task.id,
        userId: userA.id,
      })

      const { status } = await selectTaskStatus(task)

      expect(status).toBe(TaskStatus.Completed)
    })
  })

  describe('with the due date in the past', () => {
    const makePastDueInput = () => ({
      title: 'Test',
      dueAt: subDays(new Date(), 1).toISOString(),
      assignees: [userA.id],
      userId: userA.id,
    })

    it('equals PastDue when last action is Opened', async () => {
      const task = await createTask(makePastDueInput())

      const { status } = await selectTaskStatus(task)

      expect(status).toBe(TaskStatus.PastDue)
    })

    it('equals PastDue when last action is Edited', async () => {
      const task = await createTask(makePastDueInput())

      await TaskAction.query().insert({
        kind: TaskActionKind.Edited,
        taskId: task.id,
        userId: userA.id,
      })

      const { status } = await selectTaskStatus(task)

      expect(status).toBe(TaskStatus.PastDue)
    })

    it('equals Completed when last action is Closed', async () => {
      const task = await createTask(makePastDueInput())

      await TaskAction.query().insert({
        kind: TaskActionKind.Closed,
        taskId: task.id,
        userId: userA.id,
      })

      const { status } = await selectTaskStatus(task)

      expect(status).toBe(TaskStatus.Completed)
    })
  })
})
