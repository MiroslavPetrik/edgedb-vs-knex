import { taskStatusQuery } from './taskStatusQuery'
import { selectUsers } from './helpers/selectUsers'
import { User } from '../../dbschema/interfaces'
import e from '../edgedb/builder'
import { client } from '../edgedb/client'
import { createTaskQuery } from './createTaskQuery'
import { Client } from 'edgedb'
import { cleanup } from './helpers/cleanup'

describe('taskStatus', () => {
  let currentUser: User
  let currentUserClient: Client

  afterAll(cleanup)

  beforeAll(async () => {
    ;[currentUser] = await selectUsers()
    currentUserClient = client.withGlobals({ currentUserId: currentUser.id })
  })

  describe('with the due date in the future', () => {
    let dueAt: Date
    const title = 'test'

    beforeAll(async () => {
      dueAt = await e
        .select(e.op(e.datetime_current(), '+', e.cal.date_duration('2 days')))
        .run(client)
    })

    it('equals InProgress when last action is Opened', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
        dueAt,
        assignees: [currentUser.id],
      })

      const result = await taskStatusQuery.run(client, task)

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

      const result = await taskStatusQuery.run(client, task)

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

      const result = await taskStatusQuery.run(client, task)

      if (!result) {
        return
      }

      expect(result.status).toBe('Completed')
    })
  })

  describe('with the due date in the past', () => {
    let dueAt: Date
    const title = 'test'

    beforeAll(async () => {
      dueAt = await e
        .select(e.op(e.datetime_current(), '-', e.cal.date_duration('2 days')))
        .run(client)
    })

    it('equals PastDue when last action is Opened', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
        dueAt,
        assignees: [currentUser.id],
      })

      const result = await taskStatusQuery.run(client, task)

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

      const result = await taskStatusQuery.run(client, task)

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

      const result = await taskStatusQuery.run(client, task)

      if (!result) {
        return
      }

      expect(result.status).toBe('Completed')
    })
  })
})
