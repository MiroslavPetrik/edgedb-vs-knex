CREATE MIGRATION m1d4xivw4gxw2cpg25xdjdhnwyf72voujzoofn57lq4in6yhwuw6pq
    ONTO m1tfcusrjlvqrzpog7qzjoyzs2fi4odlvhaewfhvawrqo23wgkc4ua
{
  ALTER TYPE default::Task {
      ALTER PROPERTY hasNotification {
          USING (SELECT
              std::any({NOT (EXISTS (.lastSeenEvent)), (.lastSeenEvent.createdAt < .lastNotificationEvent.createdAt)})
          );
      };
  };
};
