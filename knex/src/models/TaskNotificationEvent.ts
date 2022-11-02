import { AbstractTaskEvent } from './AbstractTaskEvent'

export class TaskNotificationEvent extends AbstractTaskEvent {
  static get tableName() {
    return 'taskNotificationEvent'
  }

  static get jsonSchema() {
    return AbstractTaskEvent.mergeJsonSchema({})
  }
}
