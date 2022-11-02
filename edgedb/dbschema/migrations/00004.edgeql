CREATE MIGRATION m1d4duwkqhurhufkujaldk5ceuxplfhiczyfb4yessvysunlckydbq
    ONTO m1d4xivw4gxw2cpg25xdjdhnwyf72voujzoofn57lq4in6yhwuw6pq
{
  ALTER TYPE default::Task {
      ALTER PROPERTY hasNotification {
          USING (SELECT
              ((.lastSeenEvent.createdAt < .lastNotificationEvent.createdAt) IF EXISTS (.lastSeenEvent) ELSE EXISTS (.lastNotificationEvent))
          );
      };
  };
};
