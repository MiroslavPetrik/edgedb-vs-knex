import e from '../edgedb/builder'

export const schemaTaskStatusQuery = e.params({ id: e.uuid }, ({ id }) =>
  e.select(e.Task, () => ({
    status: true,
    filter_single: { id },
  }))
)

export const taskStatusQuery = e.params({ id: e.uuid }, ({ id }) => {
  const lastAction = e.select(e.Task['<task[is TaskAction]'], (action) => ({
    order_by: {
      expression: action.createdAt,
      direction: e.DESC,
    },
    limit: 1,
  }))

  return e.with(
    [lastAction],
    e.select(e.Task, (task) => ({
      // TODO: should infer Cardinality.One without need for assert_single
      computedStatus: e.assert_single(
        e.op(
          e.TaskStatus.Completed,
          'if',
          e.op(lastAction.kind, '=', e.TaskActionKind.Closed),
          'else',
          e.op(
            e.TaskStatus.PastDue,
            'if',
            e.op(task.dueAt, '<=', e.datetime_of_statement()),
            'else',
            e.TaskStatus.InProgress
          )
        )
      ),
      filter_single: { id },
    }))
  )
})
