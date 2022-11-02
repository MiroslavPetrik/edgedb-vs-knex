import { selectTaskStatus } from './taskStatus'
import { createTask } from './createTask'
import { addDays, subDays } from 'date-fns'
import { selectUsers } from './helpers/selectUsers'
import { User } from '../../dbschema/interfaces'
import e from '../edgedb/builder'
import { client } from '../edgedb/client'

describe('taskStatus', () => {
  let userA: User
  beforeAll(async () => {
    ;[userA] = await selectUsers()
  })

  describe('with the due date is in the future', () => {
    const makeInput = () => ({
      title: 'Test',
      dueAt: addDays(new Date(), 1),
      assignees: [userA.id],
      userId: userA.id,
    })

    it('equals InProgress when last action is Opened', async () => {
      const { task } = await createTask(makeInput())

      const result = await selectTaskStatus(task)

      if (!result) {
        return
      }

      expect(result.status).toBe('InProgress')
    })

    it('equals InProgress when last action is Edited', async () => {
      const { task } = await createTask(makeInput())

      await e
        .insert(e.TaskAction, {
          kind: e.TaskActionKind.Edited,
          user: e.global.currentUser,
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
        })
        .run(client.withGlobals({ currentUserId: userA.id }))

      const result = await selectTaskStatus(task)

      if (!result) {
        return
      }

      expect(result.status).toBe('InProgress')
    })

    it('equals Completed when last action is Closed', async () => {
      const { task } = await createTask(makeInput())

      await e
        .insert(e.TaskAction, {
          kind: e.TaskActionKind.Closed,
          user: e.global.currentUser,
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
        })
        .run(client.withGlobals({ currentUserId: userA.id }))

      const result = await selectTaskStatus(task)

      if (!result) {
        return
      }
      expect(result.status).toBe('Completed')
    })
  })

  describe('with the due date is in the past', () => {
    const makePastDueInput = () => ({
      title: 'Test',
      dueAt: subDays(new Date(), 1),
      assignees: [userA.id],
      userId: userA.id,
    })

    it('equals PastDue when last action is Opened', async () => {
      const { task } = await createTask(makePastDueInput())

      const result = await selectTaskStatus(task)

      if (!result) {
        return
      }

      expect(result.status).toBe('PastDue')
    })

    it('equals PastDue when last action is Edited', async () => {
      const { task } = await createTask(makePastDueInput())

      await e
        .insert(e.TaskAction, {
          kind: e.TaskActionKind.Edited,
          user: e.global.currentUser,
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
        })
        .run(client.withGlobals({ currentUserId: userA.id }))

      const result = await selectTaskStatus(task)

      if (!result) {
        return
      }

      expect(result.status).toBe('PastDue')
    })

    it('equals Completed when last action is Closed', async () => {
      const { task } = await createTask(makePastDueInput())

      await e
        .insert(e.TaskAction, {
          kind: e.TaskActionKind.Closed,
          user: e.global.currentUser,
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
        })
        .run(client.withGlobals({ currentUserId: userA.id }))

      const result = await selectTaskStatus(task)

      if (!result) {
        return
      }

      expect(result.status).toBe('Completed')
    })
  })
})
