import { hasNotificationQuery } from './hasNotificationQuery'
import { selectUsers } from './helpers/selectUsers'
import { Task, User } from '../../dbschema/interfaces'
import e from '../edgedb/builder'
import { client } from '../edgedb/client'
import { Client } from 'edgedb'
import { createTaskQuery } from './createTaskQuery'
import { cleanup } from './helpers/cleanup'

describe('selectHasNotification', () => {
  let currentUser: User
  let otherUser: User
  let currentUserClient: Client
  let otherUserClient: Client

  beforeAll(async () => {
    ;[currentUser, otherUser] = await selectUsers()
    currentUserClient = client.withGlobals({ currentUserId: currentUser.id })
    otherUserClient = client.withGlobals({ currentUserId: otherUser.id })
  })

  afterAll(cleanup)

  describe('when currentUser creates task with two assignees', () => {
    let task: Pick<Task, 'id'>

    beforeAll(async () => {
      let result = await createTaskQuery.run(currentUserClient, {
        title: 'Task',
        dueAt: new Date(),
        assignees: [currentUser.id, otherUser.id],
      })
      task = result.task
    })

    it('should not return notification for currentUser', async () => {
      const result = await hasNotificationQuery.run(currentUserClient, {
        id: task.id,
      })

      if (!result) {
        throw new Error()
      }

      expect(result.hasNotification).toBe(false)
    })

    it('should return notification for otherUser', async () => {
      const result = await hasNotificationQuery.run(otherUserClient, {
        id: task.id,
      })

      if (!result) {
        throw new Error()
      }

      expect(result.hasNotification).toBe(true)
    })
  })

  describe('when currentUser creates new task and otherUser sees the task', () => {
    let task: Pick<Task, 'id'>

    beforeAll(async () => {
      let result = await createTaskQuery.run(currentUserClient, {
        title: 'Task',
        dueAt: new Date(),
        assignees: [currentUser.id, otherUser.id],
      })
      task = result.task

      await e
        .insert(e.TaskSeenEvent, {
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
          user: e.global.currentUser,
        })
        .run(otherUserClient)
    })

    it('should not return any notification for otherUser', async () => {
      const result = await hasNotificationQuery.run(otherUserClient, {
        id: task.id,
      })

      if (!result) {
        throw new Error()
      }

      expect(result.hasNotification).toBe(false)
    })
  })

  describe('when currentUser creates new comment in task which was seen by otherUser', () => {
    let task: Pick<Task, 'id'>

    beforeAll(async () => {
      let result = await createTaskQuery.run(currentUserClient, {
        title: 'Task',
        dueAt: new Date(),
        assignees: [currentUser.id, otherUser.id],
      })
      task = result.task

      await e
        .insert(e.TaskSeenEvent, {
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
          user: e.global.currentUser,
        })
        .run(otherUserClient)

      await e
        .insert(e.TaskComment, {
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
          user: e.global.currentUser,
          note: 'Comment',
        })
        .run(currentUserClient)
    })

    it('should return no notification for currentUser', async () => {
      const result = await hasNotificationQuery.run(currentUserClient, {
        id: task.id,
      })

      if (!result) {
        throw new Error()
      }

      expect(result.hasNotification).toBe(false)
    })

    it('should return notification for otherUser', async () => {
      const result = await hasNotificationQuery.run(otherUserClient, {
        id: task.id,
      })

      if (!result) {
        throw new Error()
      }

      expect(result.hasNotification).toBe(true)
    })
  })
})
