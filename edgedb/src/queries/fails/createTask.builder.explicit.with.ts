import { client } from '../../edgedb/client'
import e from '../../edgedb/builder'

const insertTask = e.params(
  { title: e.str, dueAt: e.datetime, assignees: e.array(e.uuid) },
  ({ assignees, ...params }) =>
    e.insert(e.Task, {
      ...params,
      assignees: e.select(e.User, (u) => ({
        filter: e.op(u.id, 'in', e.array_unpack(assignees)),
      })),
    })
)

const insertOpenAction = e.insert(e.TaskAction, {
  kind: e.TaskActionKind.Opened,
  user: e.global.currentUser,
  task: insertTask,
})

export const createTask = e.with(
  [insertTask, insertOpenAction],
  e.select({ task: insertTask, action: insertOpenAction })
)

// TODO: query can be generated https://github.com/edgedb/edgedb-js/issues/476
export const createTasks = ({
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
