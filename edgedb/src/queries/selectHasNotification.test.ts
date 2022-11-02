import { createTask } from './createTask'
import { selectHasNotification } from './selectHasNotification'
import { selectUsers } from './helpers/selectUsers'
import { Task, User } from '../../dbschema/interfaces'
import e from '../edgedb/builder'
import { client } from '../edgedb/client'

describe('selectHasNotification', () => {
  let currentUser: User
  let otherUser: User

  beforeAll(async () => {
    ;[currentUser, otherUser] = await selectUsers()
  })

  describe('when currentUser creates task with two assignees', () => {
    let task: Pick<Task, 'id'>

    beforeAll(async () => {
      const input = {
        title: 'Task',
        assignees: [currentUser.id, otherUser.id],
        dueAt: new Date(),
        userId: currentUser.id,
      }

      let result = await createTask(input)
      task = result.task
    })

    it('should not return notification for currentUser', async () => {
      const result = await selectHasNotification({
        taskId: task.id,
        userId: currentUser.id,
      })

      if (!result) {
        throw new Error()
      }

      expect(result.hasNotification).toBe(false)
    })

    it('should return notification for otherUser', async () => {
      const result = await selectHasNotification({
        taskId: task.id,
        userId: otherUser.id,
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
      const input = {
        title: 'Task',
        assignees: [currentUser.id, otherUser.id],
        dueAt: new Date(),
        userId: currentUser.id,
      }

      let result = await createTask(input)
      task = result.task

      await e
        .insert(e.TaskSeenEvent, {
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
          user: e.global.currentUser,
        })
        .run(client.withGlobals({ currentUserId: otherUser.id }))
    })

    it('should not return any notification for otherUser', async () => {
      const result = await selectHasNotification({
        taskId: task.id,
        userId: otherUser.id,
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
      const input = {
        title: 'Task',
        assignees: [currentUser.id, otherUser.id],
        dueAt: new Date(),
        userId: currentUser.id,
      }

      let result = await createTask(input)
      task = result.task

      await e
        .insert(e.TaskSeenEvent, {
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
          user: e.global.currentUser,
        })
        .run(client.withGlobals({ currentUserId: otherUser.id }))

      await e
        .insert(e.TaskComment, {
          task: e.select(e.Task, () => ({ filter_single: { id: task.id } })),
          user: e.global.currentUser,
          note: 'Comment',
        })
        .run(client.withGlobals({ currentUserId: currentUser.id }))
    })

    it('should return no notification for currentUser', async () => {
      const result = await selectHasNotification({
        taskId: task.id,
        userId: currentUser.id,
      })

      if (!result) {
        throw new Error()
      }

      expect(result.hasNotification).toBe(false)
    })

    it('should return notification for otherUser', async () => {
      const result = await selectHasNotification({
        taskId: task.id,
        userId: otherUser.id,
      })

      if (!result) {
        throw new Error()
      }

      expect(result.hasNotification).toBe(true)
    })
  })
})
