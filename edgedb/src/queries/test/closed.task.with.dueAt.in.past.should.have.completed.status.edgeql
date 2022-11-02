start transaction;

insert TaskAction {
  kind := TaskActionKind.Opened,
  user := (select User limit 1),
  task := (
    insert Task {
      title := "Completed status test",
      dueAt := datetime_current() - <cal::date_duration>'2 days',
      assignees := (select User)
    }
  )
};

insert TaskAction {
  kind := TaskActionKind.Closed,
  user := (select User limit 1),
  # WORKARROUND: The actions share the same transaction, so we offset the creation date.
  createdAt := datetime_of_transaction() + <duration>'1 second',
  task := assert_single((select Task filter .title = "Completed status test"))
};

select assert_exists(
  (select Task filter .title = "Completed status test" and .status = TaskStatus.Completed),
  message := "Closed task with dueAt in the past should have Completed status."
);

rollback;
