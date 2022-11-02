import { Task, TaskAction, TaskComment, User } from '../models'
import {
  cleanAndSeedDatabase,
  destroyPool,
  knex,
} from 'database/utils.test.skip'
import { Knex } from 'knex'
import objection from 'objection'
import { createTask } from './createTask'
import Transaction = Knex.Transaction
import { hasNotification } from './hasNotification'
import { TaskSeenEvent } from 'models'

const { transaction, Model } = objection

beforeAll(async () => {
  await cleanAndSeedDatabase()
  await Task.query().delete()
  await TaskAction.query().delete()
  await TaskComment.query().delete()
})

afterAll(() => {
  destroyPool()
})

describe('hasNotification', () => {
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

  describe('when selfUser creates task with two assignees', () => {
    let task: Task

    beforeAll(async () => {
      const input = {
        title: 'Task',
        assignees: [selfUser.id, otherUser.id],
        dueAt: new Date().toISOString(),
        userId: selfUser.id,
      }
      task = await createTask(input)
    })

    it('should not return notification for selfUser', async () => {
      const result = await hasNotification({
        taskId: task.id,
        userId: selfUser.id,
      })
      expect(result).toBe(false)
    })

    it('should return notification for otherUser', async () => {
      const result = await hasNotification({
        taskId: task.id,
        userId: otherUser.id,
      })
      expect(result).toBe(true)
    })
  })

  describe('when selfUser creates new task and otherUser sees the task', () => {
    let task: Task

    beforeAll(async () => {
      const input = {
        title: 'Task',
        assignees: [selfUser.id, otherUser.id],
        dueAt: new Date().toISOString(),
        userId: selfUser.id,
      }

      task = await createTask(input)

      await TaskSeenEvent.query().insert({
        taskId: task.id,
        userId: otherUser.id,
      })
    })

    it('should not return any notification for otherUser', async () => {
      const result = await hasNotification({
        taskId: task.id,
        userId: otherUser.id,
      })
      expect(result).toBe(false)
    })
  })

  describe('when selfUser creates new comment in task which was seen by otherUser', () => {
    let task: Task

    beforeAll(async () => {
      const input = {
        title: 'Task',
        assignees: [selfUser.id, otherUser.id],
        dueAt: new Date().toISOString(),
        userId: selfUser.id,
      }
      task = await createTask(input)

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

    it('should return no notification for selfUser', async () => {
      const result = await hasNotification({
        taskId: task.id,
        userId: selfUser.id,
      })
      expect(result).toBe(false)
    })

    it('should return notification for otherUser', async () => {
      const result = await hasNotification({
        taskId: task.id,
        userId: otherUser.id,
      })
      expect(result).toBe(true)
    })
  })
})
