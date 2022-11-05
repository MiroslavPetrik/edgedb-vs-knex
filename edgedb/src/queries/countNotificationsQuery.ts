import e from '../edgedb/builder'

const currentUserTasks = e.select(e.Task, (task) => ({
  filter: e.op(
    e.op(e.global.currentUser, 'in', task.assignees),
    'and',
    task.hasNotification
  ),
}))

export const countNotificationsQuery = e.with(
  [currentUserTasks],
  e.select({ count: e.count(currentUserTasks) })
)

// with N := (select Task filter .hasNotification and global currentUser in .assignees)
// select {
//   matches := N {status},
//   total := count(N),
//   totalTasks := count(Task),
// };
