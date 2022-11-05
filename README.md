# edgedb-vs-knex

## About

## Goals

As our business logic, we have the following queries (from the least to the most complex)

| Query                   | Kind                              | EdgeDB                                                                     | Knex                                                           |
| ----------------------- | --------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Task status             | Computed property (user agnostic) | [taskStatus](./edgedb/src/queries/taskStatusQuery.ts)                      | [taskStatus](./knex/src/queries/taskStatus.ts)                 |
| Task hasNotification    | Computed property (user specific) | [hasNotificationQuery](./edgedb/src/queries/hasNotificationQuery.ts)       | [hasNotification](./knex/src/queries/hasNotification.ts)       |
| Task countNotifications | Aggregation (user specific)       | [countNotificationsQuery](./edgedb/src/queries/countNotificationsQuery.ts) | [countNotifications](./knex/src/queries/countNotifications.ts) |
