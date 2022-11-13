insert TaskAction {
  kind := <TaskActionKind>$kind,
  user := global currentUser,
  task := (select Task filter .id = <uuid>$id)
};
