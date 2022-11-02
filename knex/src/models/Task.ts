import { Model } from 'objection'
import { withTimestamps } from '../database/timestamps'
import { AllModels, BaseModel } from './BaseModel'
import { User } from './User'

export class Task extends withTimestamps(BaseModel) {
  id!: string
  title!: string
  dueAt!: string

  // relation
  assignees!: User[]

  static get timestamp() {
    return true
  }

  static get tableName() {
    return 'task'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'dueAt'],
      properties: {
        title: { type: 'string' },
        dueAt: { type: 'string' },
      },
    }
  }

  static get relationMappings() {
    return {
      assignees: {
        relation: Model.ManyToManyRelation,
        modelClass: AllModels.User!,
        join: {
          from: 'task.id',
          through: {
            from: 'taskAssignee.taskId',
            to: 'taskAssignee.userId',
          },
          to: 'user.id',
        },
      },
    }
  }
}
