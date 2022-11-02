import e from '../../edgedb/builder'
import { client } from '../../edgedb/client'

const selectUsersByIdQuery = e.params(
  { userIds: e.array(e.uuid) },
  ({ userIds }) =>
    e.select(e.User, (u) => ({
      ...e.User['*'],
      filter: e.op(u.id, 'in', e.array_unpack(userIds)),
    }))
)

export const selectUsersById = (userIds: string[]) =>
  selectUsersByIdQuery.run(client, { userIds })
