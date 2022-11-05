import e from '../edgedb/builder'

export const createTaskQuery = e.params(
  { title: e.str, dueAt: e.datetime, assignees: e.array(e.uuid) },
  ({ assignees, ...params }) => {
    const task = e.insert(e.Task, {
      ...params,
      assignees: e.select(e.User, (u) => ({
        filter: e.op(u.id, 'in', e.array_unpack(assignees)),
      })),
    })

    const action = e.insert(e.TaskAction, {
      kind: e.TaskActionKind.Opened,
      user: e.global.currentUser,
      task,
    })

    return e.with([task, action], e.select({ task, action }))
  }
)
