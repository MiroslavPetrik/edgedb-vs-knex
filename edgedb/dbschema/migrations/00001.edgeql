CREATE MIGRATION m1lebioy2zf3j7dzkhbamq43nyvorpgakki2bfqhz2prqhpanjkbkq
    ONTO initial
{
  CREATE GLOBAL default::currentUserId -> std::uuid;
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY familyName -> std::str;
      CREATE REQUIRED PROPERTY givenName -> std::str;
      CREATE PROPERTY name := (((.givenName ++ ' ') ++ .familyName));
  };
  CREATE GLOBAL default::currentUser := (SELECT
      default::User
  FILTER
      (.id = GLOBAL default::currentUserId)
  );
  CREATE ABSTRACT TYPE default::Timestamps {
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_of_transaction());
          SET readonly := true;
      };
      CREATE PROPERTY updatedAt -> std::datetime {
          SET default := (std::datetime_of_transaction());
      };
  };
  CREATE SCALAR TYPE default::TaskActionKind EXTENDING enum<Opened, Closed, Edited>;
  CREATE SCALAR TYPE default::TaskStatus EXTENDING enum<InProgress, PastDue, Completed>;
  CREATE TYPE default::Task EXTENDING default::Timestamps {
      CREATE REQUIRED MULTI LINK assignees -> default::User;
      CREATE REQUIRED PROPERTY dueAt -> std::datetime;
      CREATE REQUIRED PROPERTY title -> std::str;
  };
  CREATE ABSTRACT TYPE default::TaskNotificationEvent EXTENDING default::Timestamps {
      CREATE REQUIRED LINK task -> default::Task;
      CREATE REQUIRED LINK user -> default::User;
      CREATE ANNOTATION std::description := 'Task will have notification based on all subtype events compared with TaskSeenEvent.';
  };
  ALTER TYPE default::Task {
      CREATE LINK lastNotificationEvent := (SELECT
          default::Task.<task[IS default::TaskNotificationEvent] FILTER
              (.user != GLOBAL default::currentUser)
          ORDER BY
              .createdAt DESC
      LIMIT
          1
      );
  };
  CREATE TYPE default::TaskSeenEvent EXTENDING default::Timestamps {
      CREATE REQUIRED LINK task -> default::Task;
      CREATE REQUIRED LINK user -> default::User;
      CREATE ANNOTATION std::description := 'Tracks meta state when each user entered the task detail.';
  };
  ALTER TYPE default::Task {
      CREATE LINK lastSeenEvent := (SELECT
          default::Task.<task[IS default::TaskSeenEvent] FILTER
              (.user = GLOBAL default::currentUser)
          ORDER BY
              .createdAt DESC
      LIMIT
          1
      );
      CREATE PROPERTY hasNotification := (SELECT
          ((std::count(.lastSeenEvent) = 0) OR (EXISTS (.lastSeenEvent) AND (.lastSeenEvent.createdAt < .lastNotificationEvent.createdAt)))
      );
  };
  CREATE TYPE default::TaskAction EXTENDING default::TaskNotificationEvent {
      CREATE REQUIRED PROPERTY kind -> default::TaskActionKind;
      CREATE PROPERTY reason -> std::str;
  };
  ALTER TYPE default::Task {
      CREATE LINK lastAction := (SELECT
          default::Task.<task[IS default::TaskAction] ORDER BY
              .createdAt DESC
      LIMIT
          1
      );
      CREATE PROPERTY status := (SELECT
          (default::TaskStatus.InProgress IF ((.lastAction.kind != default::TaskActionKind.Closed) AND (.dueAt > std::datetime_of_statement())) ELSE (default::TaskStatus.PastDue IF ((.lastAction.kind != default::TaskActionKind.Closed) AND (.dueAt <= std::datetime_of_statement())) ELSE default::TaskStatus.Completed))
      );
  };
  CREATE TYPE default::TaskComment EXTENDING default::TaskNotificationEvent {
      CREATE REQUIRED PROPERTY note -> std::str;
  };
};
