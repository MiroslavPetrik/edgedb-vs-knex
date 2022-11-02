import { Model } from 'objection'
import { AllModels } from './BaseModel'
import { AbstractTaskEvent } from './AbstractTaskEvent'

describe('AbstractTaskEvent', () => {
  it('should merge jsonSchema with the base jsonSchema (array merged in append style)', () => {
    expect(
      AbstractTaskEvent.mergeJsonSchema({
        required: ['appendedField'],
        properties: {
          appendedField: { type: 'string' },
        },
      })
    ).toEqual({
      type: 'object',
      required: ['taskId', 'userId', 'appendedField'],
      properties: {
        taskId: { type: 'string' },
        userId: { type: 'string' },
        appendedField: { type: 'string' },
      },
    })
  })

  it('should use table name for relation mappings', () => {
    class Foo extends AbstractTaskEvent {
      static get tableName() {
        return 'foo'
      }
    }

    expect(Foo.relationMappings).toEqual({
      task: {
        relation: Model.HasOneRelation,
        modelClass: AllModels.Task!,
        join: {
          from: 'task.id',
          to: `foo.taskId`,
        },
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: AllModels.User!,
        join: {
          from: 'user.id',
          to: 'foo.userId',
        },
      },
    })
  })
})
