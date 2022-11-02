with task := (
  insert Task {
    title := <str>$title,
    # WORKARROUND: https://github.com/edgedb/edgedb-cli/issues/821#issuecomment-1296288748
    dueAt := <datetime><str>$dueAt,
    assignees := (select User)
    # WIP: Unimplemented input type descriptor: Array(ArrayTypeDescriptor { id: a1b42925-29ed-bdbe-f3a0-d773d9443ba8, type_pos: TypePos(1), dimensions: [None] })
    # assignees := (select User filter .id in array_unpack(<array<uuid>>$assignees))
  }
),
action := (
  insert TaskAction {
    kind := TaskActionKind.Opened,
    user := (select User limit 1),
    task := task
  }
)
select {
  task := task,
  action := action
};
