insert User {givenName := "Alice", familyName:= "White"};
insert User {givenName := "Bob", familyName := "Dark"};

set global currentUserId := (select User filter .givenName = "Alice" limit 1).id;

insert TaskAction {
  kind := TaskActionKind.Opened,
  user := global currentUser,
  task := (
    insert Task {
      title := 'Write a book',
      dueAt := datetime_current() + <cal::date_duration>'1 day',
      assignees := (select User)
    }
  )
};

insert TaskAction {
  kind := TaskActionKind.Opened,
  user := global currentUser,
  task := (
    insert Task {
      title := 'Ship project',
      dueAt := datetime_current() + <cal::date_duration>'3 months',
      assignees := (select User filter .givenName = "Alice" limit 1)
    }
  )
};

insert TaskAction {
  kind := TaskActionKind.Opened,
  user := global currentUser,
  task := (
    insert Task {
      title := 'Publish blog post',
      dueAt := datetime_current() + <cal::date_duration>'1 month',
      assignees := (select User)
    }
  )
};

insert TaskAction {
  kind := TaskActionKind.Opened,
  user := global currentUser,
  task := (
    insert Task {
      title := 'Host a conference',
      dueAt := datetime_current() + <cal::date_duration>'2 years',
      assignees := (select User filter .givenName = "Bob" limit 1)
    }
  )
};

insert TaskAction {
  kind := TaskActionKind.Opened,
  user := global currentUser,
  task := (
    insert Task {
      title := 'Fix bug',
      dueAt := datetime_current() + <cal::date_duration>'5 days',
      assignees := (select User filter .givenName = "Bob" limit 1)
    }
  )
};
