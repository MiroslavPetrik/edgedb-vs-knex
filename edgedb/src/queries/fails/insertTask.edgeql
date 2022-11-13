insert Task {
  title := "test",
  # Optional duration or 2week default
  dueAt := datetime_current() + <cal::date_duration><optional str>$dur if exists <optional str>$dur else datetime_current() + <cal::date_duration><str>"2 weeks",
  assignees := (select User)
};
