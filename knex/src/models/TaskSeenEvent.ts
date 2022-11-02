import { AbstractTaskEvent } from './AbstractTaskEvent'

export class TaskSeenEvent extends AbstractTaskEvent {
  static get tableName() {
    return 'taskSeenEvent'
  }

  static get jsonSchema() {
    return AbstractTaskEvent.mergeJsonSchema({})
  }
}
