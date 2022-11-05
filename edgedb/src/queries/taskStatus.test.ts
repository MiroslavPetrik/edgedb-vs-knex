import { taskStatusQuery } from './taskStatus'
import { selectUsers } from './helpers/selectUsers'
import { User } from '../../dbschema/interfaces'
import e from '../edgedb/builder'
import { client } from '../edgedb/client'
import { createTaskQuery } from './createTaskQuery'
import { Client } from 'edgedb'

describe('taskStatus', () => {
  let currentUser: User
  let currentUserClient: Client

  beforeAll(async () => {
    ;[currentUser] = await selectUsers()
    currentUserClient = client.withGlobals({ currentUserId: currentUser.id })
  })

  describe('with the due date is in the future', () => {
    let dueAt: Date
    const title = 'test'

    beforeAll(async () => {
      dueAt = await e
        .select(e.op(e.datetime_current(), '+', e.cal.date_duration('2 days')))
        .run(currentUserClient)
    })

    it('equals InProgress when last action is Opened', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
        dueAt,
        assignees: [currentUser.id],
      })

      const result = await taskStatusQuery.run(currentUserClient, task)

      if (!result) {
        return
      }

      expect(result.status).toBe('InProgress')
    })

    it('equals InProgress when last action is Edited', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
        dueAt,
        assignees: [currentUser.id],
      })

      await e
        .insert(e.TaskAction, {
          kind: e.TaskActionKind.Edited,
          user: e.global.currentUser,
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
        })
        .run(currentUserClient)

      const result = await taskStatusQuery.run(currentUserClient, task)

      if (!result) {
        return
      }

      expect(result.status).toBe('InProgress')
    })

    it('equals Completed when last action is Closed', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
        dueAt,
        assignees: [currentUser.id],
      })

      await e
        .insert(e.TaskAction, {
          kind: e.TaskActionKind.Closed,
          user: e.global.currentUser,
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
        })
        .run(currentUserClient)

      const result = await taskStatusQuery.run(currentUserClient, task)

      if (!result) {
        return
      }

      expect(result.status).toBe('Completed')
    })
  })

  describe('with the due date is in the past', () => {
    let dueAt: Date
    const title = 'test'

    beforeAll(async () => {
      dueAt = await e
        .select(e.op(e.datetime_current(), '-', e.cal.date_duration('2 days')))
        .run(currentUserClient)
    })

    it('equals PastDue when last action is Opened', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
        dueAt,
        assignees: [currentUser.id],
      })

      const result = await taskStatusQuery.run(currentUserClient, task)

      if (!result) {
        return
      }

      expect(result.status).toBe('PastDue')
    })

    it('equals PastDue when last action is Edited', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
        dueAt,
        assignees: [currentUser.id],
      })

      await e
        .insert(e.TaskAction, {
          kind: e.TaskActionKind.Edited,
          user: e.global.currentUser,
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
        })
        .run(currentUserClient)

      const result = await taskStatusQuery.run(currentUserClient, task)

      if (!result) {
        return
      }

      expect(result.status).toBe('PastDue')
    })

    it('equals Completed when last action is Closed', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
        dueAt,
        assignees: [currentUser.id],
      })

      await e
        .insert(e.TaskAction, {
          kind: e.TaskActionKind.Closed,
          user: e.global.currentUser,
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
        })
        .run(currentUserClient)

      const result = await taskStatusQuery.run(currentUserClient, task)

      if (!result) {
        return
      }

      expect(result.status).toBe('Completed')
    })
  })
})
