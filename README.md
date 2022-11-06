# edgedb-vs-knex

This project contains two Typescript implementations of a task system. The reference implementation is in 'traditional' [knex](https://knexjs.org/)/[objection](https://vincit.github.io/objection.js/) ORM. The second implementation is in a modern graph-relational [EdgeDB](https://www.edgedb.com/) using its awesome query builder.

The goal of this project is to practicaly test out the EdgeDB and compare it side-by-side with a traditional ORM setup.

## Schema

![](./images/schema.png)

- gray box - abstract class
- blue box - concrete entities
- gray arrow - inheritance
- pink arrow - relation

### Description

At the center of our model is a **Task** which holds a `title`, `dueDate` and `assignees`. Each task can be `Opened`, `Closed` or `Edited` multiple times. The state of the task is tracked by the **TaskAction**. From the combination of the `dueDate` and the _last action_ we will compute a `status`. The status will have one of three values:

- `Completed` when the task is closed.
- `PastDue` when the task is not closed and the due date is in the past.
- `InProgress` when the task is not closed & the due date was not reached yet.

Next, there is **TaskComment** related to a user & a task.
Together with **TaskAction**, they extend the **TaskNotificationEvent**, meaning that when an action or comment is added to the task, the `assignees` will have see a 'notification flag' when quering the task.

Finally, to 'clear the notification' user will add a **TaskSeenEvent** which will 'shadow' the **TaskNotificationEvent** -- when the _last seen event_ is the most recent than all the notification events, the task will not have a notification.

## Queries/Scenarios

Based on the description, we've implemented three queries:

| Query                   | Kind                              | EdgeDB                                                                     | Knex                                                           |
| ----------------------- | --------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Task status             | Computed property (user agnostic) | [taskStatus](./edgedb/src/queries/taskStatusQuery.ts)                      | [taskStatus](./knex/src/queries/taskStatus.ts)                 |
| Task hasNotification    | Computed property (user specific) | [hasNotificationQuery](./edgedb/src/queries/hasNotificationQuery.ts)       | [hasNotification](./knex/src/queries/hasNotification.ts)       |
| Task countNotifications | Aggregation (user specific)       | [countNotificationsQuery](./edgedb/src/queries/countNotificationsQuery.ts) | [countNotifications](./knex/src/queries/countNotifications.ts) |

## Comparison

### Migrations/Schema

With Knex, we define database schema by a set of [migrations](./knex/src/database/migrations/). As the project grows, we can get the schema either by mentally aggregating the migrations or introspecting a live database with applied migrations.

EdgeDB on the other hand has a [schema file](./edgedb/dbschema/default.esdl) which we edit, and the CLI generates [the migrations](./edgedb/dbschema/migrations/) for us.
Other ORMs like Prisma have a schema file, which adds to developer's productivity.

### Typescript model

Within the knex workspace, we model our Typesscript classes with the objection.js ORM.
This requires us to write [write manual relations](./knex/src/models/Task.ts#L33) based on the foreign keys previously defined in the migrations. This can feel prodecural, repetitive or low-level. This is called object-relational impedance mismatch - we must translate the relational database model realized as tables into the javascript language model which uses objects with properties/links to other objects.

With EdgeDB, our schema represents our model which goes beyond relations. We no longer have to deal with primary & foreign keys, or manually specifying cardinality like `many-to-many`.
The EdgeQL has a 'higher' concept of links, which abstracts away the low-level details of relational data. To get the typescript model ready, we [generate query builder & interfaces](./edgedb/package.json#L9) without writting any code.

### Class hierarchy

Our model contains abstract type **TaskNotificationEvent** which has two child/concrete classes **TaskAction** and **TaskComment**. Now in our second scenario/query of computing `Task.hasNotification` we have to query both the **TaskAction** and **TaskComment** to check if a task has notification for a user.

Within EdgeDB, the abstract **TaskNotificationEvent** type is [queryable out-of-the-box](./edgedb/src/queries/hasNotificationQuery.ts#L24) as the engine creates a view of the child types for us.

With Knex, we had to construct such [view manually in a migration](./knex/src/database/migrations/3_create_task_table.ts#L75).

### Selecting a computed `enum` property

In our first scenario to select a `taskStatus` we've defined an enum of 3 values.

In relational tables, we usually store only normalized data, so we rather define & [place the derived enum in the application logic](./knex/src/queries/taskStatus.ts#L4). The `taskStatus` query itself uses raw SQL, which is sometimes a drawback of ORM, that you still have to use SQL.

In EdgeDB, the schema is a blend of the data model _and_ the application logic. We can [define the enum as first class model property](./edgedb/dbschema/default.esdl#L57) and get it into typescript by generating the interface. There is still a room for improvement, as the generator outputs union of literals, instead of real typescript enum:

```typescript
export type TaskStatus = 'InProgress' | 'PastDue' | 'Completed'
```

This has drawback that [we use status strings in tests](./edgedb/src/queries/taskStatusQuery.test.ts#L48).
We didn't see this in our knex implementation, where we've [referenced the enum keys](./knex/src/queries/taskStatus.test.ts#L30).

The expression to compute the [`taskStatus` expressed in EdgeDB Typescript builder](./edgedb/src/queries/taskStatusQuery.ts#L23) is much harder to read compared to [its plain EdgeQL version](./edgedb/dbschema/default.esdl#L34). The `e.op` calls simply clutter the expression.

### Testing a multi-user scenario

Our second query, to check whether a task has a notification depends on user context, meaning two users
running the query can get different result.

In knex, we just pass `userId` as a regular query parameter.

With EdgeDB, we take an advantage of the _global variables_. In our tests, we [create two client instances](./edgedb/src/queries/hasNotificationQuery.test.ts#L23), with different `currentUserId` values. Then we just run the same queries for different users.
This leads to a great developer experience and code readability!

### Parametrized query/insertion

In our tests suites we are creating mock data under various conditions. Inserting data requires passing arguments to our queries.

With the knex implementation, we just write regular typescript functions. The query builder has a [nice graph api](./knex/src/queries/createTask.ts#L15), to support inserting nested structures & relate them.

With EdgeDB, our queries have first class [support for parameters](./edgedb/src/queries/createTaskQuery.ts#L4), meaning we don't have to write any wrapper functions. Moreover the graph api is a default, as its the property of the underlying EdgeQL.

To test the knex implementation we've used `date-fns` library to produce [variable dates](./knex/src/queries/taskStatus.test.ts#L20) for our mock data. On the other hand, with EdgeDB we didn't have such need, as the query builder supports the [native date functions for durations](./edgedb/src/queries/taskStatusQuery.test.ts#L30) and more.

There is still room for improvement - e.g. sending a select query as a parameter.

### Reducing the Typescript code (EdgeDB only)

With EdgeDB, besides the query builder, we can also use the plain EdgeQL. In fact [we've mirrored the queries directly in schema](./edgedb/dbschema/default.esdl#L34). But since we wanted to have fair comparison of typescript-only queries, we wrote the queries fully in the EdgeDB Typescript query builder.

Having queries in the schema/in the DB server permits us to share the logic between clients in different languages.

To utilize these schema queries, we've also experimented with [EdgeQL scripts acting as tests](./edgedb/src/queries/test/taskStatus.edgeql).
