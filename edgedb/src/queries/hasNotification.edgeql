set global currentUserId := (select User filter .givenName = "Bob" limit 1).id;
set global currentUserId := (select User filter .givenName = "Alice" limit 1).id;

insert TaskAction {
  kind := "Opened",
  user := global currentUser,
  task := (select Task filter .title = "Cook fish" limit 1)
};

insert TaskAction {
  kind := "Opened",
  user := global currentUser,
  task := (select Task filter .title = "Apply for a job" limit 1)
};

insert TaskAction {
  kind := "Closed",
  user := global currentUser,
  task := (select Task filter .title = "Cook fish" limit 1)
};

insert TaskSeenEvent {
  user := global currentUser,
  task := (select Task filter .title = "Cook fish" limit 1)
};

insert TaskComment {
  note := "I have to write email first",
  user := global currentUser,
  task := (select Task filter .title = "Apply for a job" limit 1)
};

select Task {
  title,
  hasNotification := (
    with
      events := (select TaskAction union TaskComment filter .task.id = Task.id), # TODO: could be alias type -> query
      lastSeen := (select TaskAction filter .task.id = Task.id and .kind = <TaskActionKind>"Seen" and .user = global currentUser order by .createdAt desc limit 1),
      lastEvent := (select events filter .task.id = Task.id and .user != global currentUser order by .createdAt desc limit 1)
    select (not exists lastSeen) or (lastSeen.createdAt < lastEvent.createdAt)
  ),
} filter global currentUser in .assignees;


with N := (select Task filter .hasNotification and global currentUser in .assignees)
select {
  matches := N {status},
  total := count(N),
  totalTasks := count(Task),
};
