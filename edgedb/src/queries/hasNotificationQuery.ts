import e from '../edgedb/builder'

export const schemaHasNotificationQuery = e.params({ id: e.uuid }, ({ id }) =>
  e.select(e.Task, () => ({
    hasNotification: true,
    filter_single: { id },
  }))
)

export const hasNotificationQuery = e.params({ id: e.uuid }, ({ id }) => {
  const lastSeenEvent = e.select(
    e.Task['<task[is TaskSeenEvent]'],
    (event) => ({
      filter: e.op(event.user, '=', e.global.currentUser),
      order_by: {
        expression: event.createdAt,
        direction: e.DESC,
      },
      limit: 1,
    })
  )

  const lastNotificationEvent = e.select(
    e.Task['<task[is TaskNotificationEvent]'],
    (event) => ({
      filter: e.op(event.user, '!=', e.global.currentUser),
      order_by: {
        expression: event.createdAt,
        direction: e.DESC,
      },
      limit: 1,
    })
  )

  return e.select(e.Task, () => ({
    computedHasNotification: e.assert_single(
      e.op(
        e.op(lastSeenEvent.createdAt, '<', lastNotificationEvent.createdAt),
        'if',
        e.op('exists', lastSeenEvent),
        'else',
        e.op('exists', lastNotificationEvent)
      )
    ),
    filter_single: { id },
  }))
})
