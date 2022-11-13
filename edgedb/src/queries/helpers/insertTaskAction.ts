import e from '../../edgedb/builder'

export const insertTaskActionQuery = e.params(
  { id: e.uuid, kind: e.TaskActionKind },
  ({ id, kind }) =>
    e.insert(e.TaskAction, {
      kind,
      user: e.global.currentUser,
      task: e.select(e.Task, () => ({ filter_single: { id } })),
    })
)
