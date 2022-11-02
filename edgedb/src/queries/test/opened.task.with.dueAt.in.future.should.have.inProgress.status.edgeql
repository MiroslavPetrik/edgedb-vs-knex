# edgedb query --file ./src/queries/test/task.with.dueAt.in.future.should.have.inProgress.status.edgeql
start transaction;

insert TaskAction {
  kind := TaskActionKind.Opened,
  user := (select User limit 1),
  task := (
    insert Task {
      title := "InProgress test",
      dueAt := datetime_current() + <cal::date_duration>'2 days',
      assignees := (select User)
    }
  )
};

select assert_exists(
  (select Task filter .title = "InProgress test" and .status = TaskStatus.InProgress),
  message := "Task with dueAt in the future should have InProgress status."
);

rollback;
