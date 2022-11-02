import { AbstractTaskEvent } from './AbstractTaskEvent'

export enum TaskActionKind {
  Opened = 'Opened',
  Closed = 'Closed',
  Edited = 'Edited',
}

export class TaskAction extends AbstractTaskEvent {
  kind!: keyof typeof TaskActionKind

  static get tableName() {
    return 'taskAction'
  }

  static get jsonSchema() {
    return AbstractTaskEvent.mergeJsonSchema({
      required: ['kind'],
      properties: {
        kind: { type: 'string', enum: Object.values(TaskActionKind) },
      },
    })
  }
}
