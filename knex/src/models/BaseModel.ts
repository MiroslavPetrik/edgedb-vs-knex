import { mapValues } from 'lodash'
import { Model, ModelOptions } from 'objection'
import { CustomQueryBuilder } from './query-builders/CustomQueryBuilder'

export class BaseModel extends Model {
  // @ts-ignore TODO
  QueryBuilderType!: CustomQueryBuilder<this>
  static QueryBuilder = CustomQueryBuilder
  static get useLimitInFirst() {
    return true
  }

  $parseJson(json: JSON, opt?: ModelOptions) {
    const parsedJson = super.$parseJson(json, opt)

    return mapValues(parsedJson, (value: unknown) =>
      typeof value === 'string' ? value.trim() : value
    )
  }
}

interface AllModelsType {
  User: typeof Model
  Task: typeof Model
  TaskAction: typeof Model
  TaskComment: typeof Model
  TaskNotificationEvent: typeof Model
  TaskSeenEvent: typeof Model
}

// WORKAROUND: webpack doesn't correctly handle async importing for solving cyclic dependency
export const AllModels: Partial<AllModelsType> = {}
