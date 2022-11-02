import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import path from 'path'

/**
 * Load & expand env variables in non-Next.js context.
 * Use for knex or other dev purposes.
 */
expand(dotenv.config({ path: path.join(__dirname, '../../.env') }))
