import { withTimestamps } from '../database/timestamps'
import { BaseModel } from './BaseModel'

export class User extends withTimestamps(BaseModel) {
  id!: string
  givenName!: string
  familyName!: string

  static get timestamps() {
    return true
  }

  static get tableName() {
    return 'user'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['givenName', 'familyName'],
      properties: {
        givenName: { type: 'string' },
        familyName: { type: 'string' },
      },
    }
  }
}
