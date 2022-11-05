import e from '../edgedb/builder'

export const hasNotificationQuery = e.params({ id: e.uuid }, ({ id }) =>
  e.select(e.Task, () => ({
    hasNotification: true,
    filter_single: { id },
  }))
)
