import { AbstractTaskEvent } from './AbstractTaskEvent'

export class TaskComment extends AbstractTaskEvent {
  id!: string
  note!: string

  static get tableName() {
    return 'taskComment'
  }

  static get jsonSchema() {
    return AbstractTaskEvent.mergeJsonSchema({
      required: ['note'],
      properties: {
        note: { type: 'string' },
      },
    })
  }
}
