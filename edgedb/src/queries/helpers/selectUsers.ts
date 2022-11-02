import e from '../../edgedb/builder'
import { client } from '../../edgedb/client'

const selectUsersQuery = e.select(e.User, () => ({
  ...e.User['*'],
  limit: 2,
}))

export const selectUsers = () => selectUsersQuery.run(client)
