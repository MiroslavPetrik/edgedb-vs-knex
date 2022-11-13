import e from '../edgedb/builder'

export const createTaskQuery = e.params(
  {
    title: e.str,
    dueAt: e.optional(e.datetime),
    deadline: e.optional(e.cal.date_duration),
    assignees: e.array(e.uuid),
  },
  ({ assignees, dueAt, deadline, ...params }) => {
    const task = e.insert(e.Task, {
      ...params,
      dueAt: e.op(
        e.op(e.datetime_current(), '+', deadline),
        'if',
        e.op('exists', deadline),
        'else',
        e.op(
          dueAt,
          'if',
          e.op('exists', dueAt),
          'else',
          e.op(e.datetime_current(), '+', e.cal.date_duration('2 weeks'))
        )
      ),
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
