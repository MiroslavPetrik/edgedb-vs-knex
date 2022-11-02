import { initModel } from '../models/init'
import { getKnexConfig } from './config'
import './env'

const config = getKnexConfig()
initModel()

console.info(`Knex Connecting to: ${config.connection}`)

// The cli required default export
// eslint-disable-next-line import/no-default-export
export default config
