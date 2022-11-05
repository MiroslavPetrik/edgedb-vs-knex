CREATE MIGRATION m1baw6l5edcvo3res2yijpq4m5shc6go2vmf6jvw7yymvknmop7r5a
    ONTO m1d4duwkqhurhufkujaldk5ceuxplfhiczyfb4yessvysunlckydbq
{
  ALTER TYPE default::Task {
      ALTER PROPERTY status {
          USING (SELECT
              (default::TaskStatus.Completed IF (.lastAction.kind = default::TaskActionKind.Closed) ELSE (default::TaskStatus.PastDue IF (.dueAt <= std::datetime_of_statement()) ELSE default::TaskStatus.InProgress))
          );
      };
  };
};
