import { selectUsersById } from './selectUsersById'
import { selectUsers } from './selectUsers'

describe('selectUsersById', () => {
  it('should return multiple users', async () => {
    const users = await selectUsers()

    const result = await selectUsersById([
      ...users.map(({ id }) => id),
      '2053a8b4-49b1-437a-84c8-af5d3f383484', // non-existent id
    ])

    expect(users.length).toBe(result.length)
  })
})
