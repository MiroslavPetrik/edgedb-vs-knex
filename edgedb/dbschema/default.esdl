module default {

    global currentUserId -> uuid;

    global currentUser := (
      select User filter .id = global currentUserId
    );

    abstract type Timestamps {
      required property createdAt -> datetime {
        default := datetime_of_transaction();
        readonly := true;
      };

      required property updatedAt -> datetime {
        default := datetime_of_transaction();
      };
    }

    type User {
      required property givenName -> str;
      required property familyName -> str;
      property name := .givenName ++ ' ' ++ .familyName;
    }

    type Task extending Timestamps {
      required property title -> str;
      required property dueAt -> datetime;
      required multi link assignees -> User;

      link lastAction := (select Task.<task[is TaskAction] order by .createdAt desc limit 1);

      # datetime_of_statement is non-volatile (datetime_current will raise compilation error)
      property status := (select
        TaskStatus.Completed if .lastAction.kind = TaskActionKind.Closed else
        TaskStatus.PastDue if .dueAt <= datetime_of_statement() else
        TaskStatus.InProgress
      );

      link lastSeenEvent := (
        select Task.<task[is TaskSeenEvent]
        filter .user = global currentUser
        order by .createdAt desc limit 1
      );

      link lastNotificationEvent := (
        select Task.<task[is TaskNotificationEvent]
        filter .user != global currentUser
        order by .createdAt desc limit 1
      );

      property hasNotification := (
        select .lastSeenEvent.createdAt < .lastNotificationEvent.createdAt if exists .lastSeenEvent else exists .lastNotificationEvent
      );
    }

    scalar type TaskStatus extending enum<InProgress, PastDue, Completed>;

    type TaskSeenEvent extending Timestamps {
      annotation description := 'Tracks meta state when each user entered the task detail.';
      required link task -> Task;
      required link user -> User;
    }

    abstract type TaskNotificationEvent extending Timestamps {
      annotation description := 'Task will have notification based on all subtype events compared with TaskSeenEvent.';
      required link task -> Task;
      required link user -> User;
    }

    scalar type TaskActionKind extending enum<Opened, Closed, Edited>;

    type TaskAction extending TaskNotificationEvent {
      required property kind -> TaskActionKind;
      property reason -> str;
    }

    type TaskComment extending TaskNotificationEvent {
      required property note -> str;
    }
}
