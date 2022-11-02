import { Knex } from 'knex'
import { Model } from 'objection'
import { User } from '../../models'

const users = [
  {
    givenName: 'Alice',
    familyName: 'White',
  },
  {
    givenName: 'Bob',
    familyName: 'Dark',
  },
]

export const seed = async (knex: Knex) => {
  Model.knex(knex)
  await User.query().insert(users)
}
