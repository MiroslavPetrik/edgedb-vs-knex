import { Knex } from 'knex'
import objection from 'objection'
import {
  cleanAndSeedDatabase,
  destroyPool,
  knex,
} from 'database/utils.test.skip'
import Transaction = Knex.Transaction
import { Task, User, TaskAction, TaskComment, TaskSeenEvent } from 'models'
const { transaction, Model } = objection
import { countNotifications } from './countNotifications'
import { createTask } from './createTask'

beforeAll(async () => {
  await cleanAndSeedDatabase()
  await Task.query().delete()
  await TaskAction.query().delete()
  await TaskComment.query().delete()
})

afterAll(() => {
  destroyPool()
})

describe('countNotificationsQuery', () => {
  let selfUser: User
  let otherUser: User
  let sharedTransaction: Transaction

  beforeAll(async () => {
    ;[selfUser, otherUser] = await User.query().limit(2)
  })

  beforeEach(async () => {
    sharedTransaction = await transaction.start(knex)
    Model.knex(sharedTransaction)
  })

  afterEach(async () => {
    await sharedTransaction.rollback()
    Model.knex(knex)
  })

  describe('when currentUser creates n tasks assigned to the otherUser', () => {
    const notificationCount = 3
    beforeAll(async () => {
      let repeat = notificationCount

      while (repeat--) {
        await createTask({
          title: 'Task',
          assignees: [selfUser.id, otherUser.id],
          dueAt: new Date().toISOString(),
          userId: selfUser.id,
        })
      }
    })

    it('should count zero notifications for currentUser', async () => {
      const count = await countNotifications({ userId: selfUser.id })

      expect(count).toBe(0)
    })

    it('should count n notifications for otherUser', async () => {
      const count = await countNotifications({ userId: otherUser.id })

      expect(count).toBe(notificationCount)
    })
  })

  describe('when currentUser creates a task and otherUser sees it', () => {
    beforeAll(async () => {
      let task = await createTask({
        title: 'Task',
        assignees: [selfUser.id, otherUser.id],
        dueAt: new Date().toISOString(),
        userId: selfUser.id,
      })

      await TaskSeenEvent.query().insert({
        taskId: task.id,
        userId: otherUser.id,
      })
    })

    it('should count zero notifications', async () => {
      const count = await countNotifications({ userId: otherUser.id })

      expect(count).toBe(0)
    })
  })

  describe('when currentUser creates new comment in task which was seen by otherUser', () => {
    beforeAll(async () => {
      const task = await createTask({
        title: 'Task',
        assignees: [selfUser.id, otherUser.id],
        dueAt: new Date().toISOString(),
        userId: selfUser.id,
      })

      await TaskSeenEvent.query().insert({
        taskId: task.id,
        userId: otherUser.id,
      })

      await TaskComment.query().insert({
        taskId: task.id,
        userId: selfUser.id,
        note: 'Comment',
      })
    })

    it('should count zero notifications for currentUser', async () => {
      const count = await countNotifications({ userId: selfUser.id })

      expect(count).toBe(0)
    })

    it('should count one notification for otherUser', async () => {
      const count = await countNotifications({ userId: otherUser.id })

      expect(count).toBe(1)
    })
  })
})
