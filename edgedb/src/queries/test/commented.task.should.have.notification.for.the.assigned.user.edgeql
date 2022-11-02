start transaction;

set global currentUserId := assert_exists((select User filter .givenName = "Alice" limit 1), message := "No users!").id;

insert TaskAction {
  kind := TaskActionKind.Opened,
  user := global currentUser,
  task := (
    insert Task {
      title := "commented task notification",
      dueAt := datetime_current(),
      assignees := (select User)
    }
  )
};

set global currentUserId := (select User filter .givenName = "Bob" limit 1).id;

insert TaskSeenEvent {
  user := global currentUser,
  task := (select Task filter .title = "commented task notification" limit 1)
};

select assert_exists(
  (select Task filter .title = "commented task notification" and not .hasNotification),
  message := "Seen task should NOT have notification for currentUser."
);

insert TaskComment {
  user := (select User filter .givenName = "Alice" limit 1),
  task := (select Task filter .title = "commented task notification" limit 1),
  note := "example"
};

select assert_exists(
  (select Task filter .title = "commented task notification" and .hasNotification),
  message := "Commented task by otherUser should have notification for the currentUser."
);

rollback;
