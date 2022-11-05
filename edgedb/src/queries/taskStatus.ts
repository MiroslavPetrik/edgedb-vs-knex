import e from '../edgedb/builder'

export const taskStatusQuery = e.params({ id: e.uuid }, ({ id }) =>
  e.select(e.Task, () => ({
    status: true,
    filter_single: { id },
  }))
)
