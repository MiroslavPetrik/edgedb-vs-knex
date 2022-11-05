import e from '../../edgedb/builder'
import { client } from '../../edgedb/client'

export const cleanup = async () => {
  // Improvement: transactions to avoid manual delete
  await e.delete(e.TaskAction).run(client)
  await e.delete(e.TaskSeenEvent).run(client)
  await e.delete(e.TaskComment).run(client)
  await e.delete(e.Task).run(client)
}
