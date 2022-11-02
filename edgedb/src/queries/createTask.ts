import { client } from '../edgedb/client'

// TODO: query can be generated https://github.com/edgedb/edgedb-js/issues/476
export const createTask = ({
  userId,
  title,
  dueAt,
  assignees,
}: {
  userId: string
  title: string
  dueAt: Date
  assignees: string[]
}) =>
  client
    .withGlobals({ currentUserId: userId })
    .queryRequiredSingle<{ task: { id: string }; action: { id: string } }>(
      `
    with task := (
      insert Task {
        title := <str>$title,
        dueAt := <datetime>$dueAt,
        assignees := (select User filter .id in array_unpack(<array<uuid>>$assignees))
      }
    ),
    action := (
      insert TaskAction {
        kind := TaskActionKind.Opened,
        user := global currentUser,
        task := task
      }
    )
    select {
      task := task,
      action := action
    };
`,
      { title, dueAt, assignees }
    )
