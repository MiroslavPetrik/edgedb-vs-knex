import { isArray, mergeWith } from 'lodash'
import { Model } from 'objection'
import { withTimestamps } from '../database/timestamps'
import { AllModels, BaseModel } from './BaseModel'
import { Task } from './Task'
import { User } from './User'

export class AbstractTaskEvent extends withTimestamps(BaseModel) {
  taskId!: string
  userId!: string
  createdAt!: string
  updatedAt!: string

  // relation
  task!: Task
  user!: User

  static get timestamps() {
    return true
  }

  static mergeJsonSchema(childJsonSchema: Record<string, unknown>) {
    return mergeWith(
      {
        type: 'object',
        required: ['taskId', 'userId'],
        properties: {
          taskId: { type: 'string' },
          userId: { type: 'string' },
        },
      },
      childJsonSchema,
      (objValue, srcValue) => {
        if (isArray(objValue)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return [...objValue, ...srcValue]
        }
        return undefined
      }
    )
  }

  static get relationMappings() {
    return {
      task: {
        relation: Model.HasOneRelation,
        modelClass: AllModels.Task!,
        join: {
          from: 'task.id',
          to: `${this.tableName}.taskId`,
        },
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: AllModels.User!,
        join: {
          from: 'user.id',
          to: `${this.tableName}.userId`,
        },
      },
    }
  }
}
