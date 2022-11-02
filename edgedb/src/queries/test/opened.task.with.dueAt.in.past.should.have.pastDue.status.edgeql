# edgedb query --file ./src/queries/test/task.with.dueAt.in.past.should.have.pastDueStatus.edgeql
start transaction;

insert TaskAction {
  kind := TaskActionKind.Opened,
  user := (select User limit 1),
  task := (
    insert Task {
      title := "PastDue test",
      dueAt := datetime_current() - <cal::date_duration>'2 days',
      assignees := (select User)
    }
  )
};

select assert_exists(
  (select Task filter .title = "PastDue test" and .status = TaskStatus.PastDue),
  message := "Task with dueAt in the past should have PastDue status."
);

rollback;
