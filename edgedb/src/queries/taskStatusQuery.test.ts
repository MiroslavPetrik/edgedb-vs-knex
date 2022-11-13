import { taskStatusQuery } from './taskStatusQuery'
import { User } from '../../dbschema/interfaces'
import e from '../edgedb/builder'
import { client } from '../edgedb/client'
import { createTaskQuery } from './createTaskQuery'
import { Client, DateDuration } from 'edgedb'
import { cleanup } from './helpers/cleanup'
import { insertTaskActionQuery } from './helpers/insertTaskAction'

describe('taskStatusQuery', () => {
  let currentUser: User
  let currentUserClient: Client

  afterAll(cleanup)

  beforeAll(async () => {
    ;[currentUser] = await e
      .select(e.User, () => ({
        ...e.User['*'],
        limit: 1,
      }))
      .run(client)
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
        throw new Error()
      }

      expect(result.computedStatus).toBe('InProgress')
    })

    it('equals InProgress when last action is Edited', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
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
        throw new Error()
      }

      expect(result.computedStatus).toBe('InProgress')
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
        throw new Error()
      }

      expect(result.computedStatus).toBe('Completed')
    })
  })

  describe('with the due date in the past', () => {
    const title = 'test'
    const deadline = new DateDuration(0, 0, 0, -2)

    it('equals PastDue when last action is Opened', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
        deadline,
        assignees: [currentUser.id],
      })

      const result = await taskStatusQuery.run(client, task)

      if (!result) {
        throw new Error()
      }

      expect(result.computedStatus).toBe('PastDue')
    })

    it('equals PastDue when last action is Edited', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
        deadline,
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
        throw new Error()
      }

      expect(result.computedStatus).toBe('PastDue')
    })

    it('equals Completed when last action is Closed', async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title,
        deadline,
        assignees: [currentUser.id],
      })

      await insertTaskActionQuery.run(currentUserClient, {
        id: task.id,
        kind: 'Closed',
      })

      const result = await taskStatusQuery.run(client, task)

      if (!result) {
        throw new Error()
      }

      expect(result.computedStatus).toBe('Completed')
    })
  })
})
