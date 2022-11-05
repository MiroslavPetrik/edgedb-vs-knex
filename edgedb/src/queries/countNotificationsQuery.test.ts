import { User } from '../../dbschema/interfaces'
import e from '../edgedb/builder'
import { client } from '../edgedb/client'
import { Client } from 'edgedb'
import { createTaskQuery } from './createTaskQuery'
import { countNotificationsQuery } from './countNotificationsQuery'
import { cleanup } from './helpers/cleanup'

describe('countNotificationsQuery', () => {
  let currentUser: User
  let otherUser: User
  let currentUserClient: Client
  let otherUserClient: Client

  beforeAll(async () => {
    await cleanup()
    ;[currentUser, otherUser] = await e
      .select(e.User, () => ({
        ...e.User['*'],
        limit: 2,
      }))
      .run(client)
    currentUserClient = client.withGlobals({ currentUserId: currentUser.id })
    otherUserClient = client.withGlobals({ currentUserId: otherUser.id })
  })

  describe('when currentUser creates n tasks assigned to the otherUser', () => {
    const notificationCount = 3
    beforeAll(async () => {
      let repeat = notificationCount

      while (repeat--) {
        await createTaskQuery.run(currentUserClient, {
          title: 'Task',
          dueAt: new Date(),
          assignees: [currentUser.id, otherUser.id],
        })
      }
    })

    afterAll(cleanup)

    it('should count zero notifications for currentUser', async () => {
      const result = await countNotificationsQuery.run(currentUserClient)

      expect(result.count).toBe(0)
    })

    it('should count n notifications for otherUser', async () => {
      const result = await countNotificationsQuery.run(otherUserClient)

      expect(result.count).toBe(notificationCount)
    })
  })

  describe('when currentUser creates a task and otherUser sees it', () => {
    beforeAll(async () => {
      let { task } = await createTaskQuery.run(currentUserClient, {
        title: 'Task',
        dueAt: new Date(),
        assignees: [currentUser.id, otherUser.id],
      })

      await e
        .insert(e.TaskSeenEvent, {
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
          user: e.global.currentUser,
        })
        .run(otherUserClient)
    })

    afterAll(cleanup)

    it('should count zero notifications', async () => {
      const result = await countNotificationsQuery.run(otherUserClient)

      expect(result.count).toBe(0)
    })
  })

  describe('when currentUser creates new comment in task which was seen by otherUser', () => {
    beforeAll(async () => {
      const { task } = await createTaskQuery.run(currentUserClient, {
        title: 'Task',
        dueAt: new Date(),
        assignees: [currentUser.id, otherUser.id],
      })

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

    afterAll(cleanup)

    it('should count zero notifications for currentUser', async () => {
      const result = await countNotificationsQuery.run(currentUserClient)

      expect(result.count).toBe(0)
    })

    it('should count one notification for otherUser', async () => {
      const result = await countNotificationsQuery.run(otherUserClient)

      expect(result.count).toBe(1)
    })
  })
})
