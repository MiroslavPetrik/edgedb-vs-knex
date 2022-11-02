start transaction;

set global currentUserId := assert_exists((select User filter .givenName = "Alice" limit 1), message := "No users!").id;

insert TaskAction {
  kind := TaskActionKind.Opened,
  user := global currentUser,
  task := (
    insert Task {
      title := "Opened task notification",
      dueAt := datetime_current(),
      assignees := (select User)
    }
  )
};

select assert_exists(
  (select Task filter .title = "Opened task notification" and not .hasNotification),
  message := "Opened task should NOT have notification for the currentUser."
);

set global currentUserId := (select User filter .givenName = "Bob" limit 1).id;

select assert_exists(
  (select Task filter .title = "Opened task notification" and .hasNotification),
  message := "Opened task should have notification for the assigned user."
);

rollback;
