import { knex } from 'knex'
import { Model } from 'objection'
import { initModel } from '../models/init'
import { getKnexConfig } from './config'

export const initDatabase = (config = getKnexConfig()) => {
  initModel()
  const instance = knex(config)
  Model.knex(instance)
  return instance
}
