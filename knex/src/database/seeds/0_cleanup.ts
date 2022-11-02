import { cleanDatabase } from '../utils.test.skip'

export async function seed() {
  await cleanDatabase()
}
