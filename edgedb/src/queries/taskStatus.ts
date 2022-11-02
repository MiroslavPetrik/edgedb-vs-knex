import e from '../edgedb/builder'
import { client } from '../edgedb/client'

const taskStatusQuery = e.params({ id: e.uuid }, ({ id }) =>
  e.select(e.Task, () => ({
    status: true,
    filter_single: { id },
  }))
)

export const selectTaskStatus = ({ id }: { id: string }) =>
  taskStatusQuery.run(client, {
    id,
  })
