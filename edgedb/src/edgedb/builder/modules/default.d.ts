import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
export declare type $TaskActionKind = {
  Opened: $.$expr_Literal<$TaskActionKind>;
  Closed: $.$expr_Literal<$TaskActionKind>;
  Edited: $.$expr_Literal<$TaskActionKind>;
} & $.EnumType<"default::TaskActionKind", ["Opened", "Closed", "Edited"]>;
declare const TaskActionKind: $TaskActionKind

export declare type $TaskStatus = {
  InProgress: $.$expr_Literal<$TaskStatus>;
  PastDue: $.$expr_Literal<$TaskStatus>;
  Completed: $.$expr_Literal<$TaskStatus>;
} & $.EnumType<"default::TaskStatus", ["InProgress", "PastDue", "Completed"]>;
declare const TaskStatus: $TaskStatus

export declare type $TimestampsλShape = $.typeutil.flatten<_std.$Object_dd264c4250cc11ed8c36bf66839c7329λShape & {
  "createdAt": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, true, true>;
  "updatedAt": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, true>;
}>;
declare type $Timestamps = $.ObjectType<"default::Timestamps", $TimestampsλShape, null, [
  ..._std.$Object_dd264c4250cc11ed8c36bf66839c7329['__exclusives__'],
]>;
declare const $Timestamps: $Timestamps

declare const Timestamps: $.$expr_PathNode<$.TypeSet<$Timestamps, $.Cardinality.Many>, null> 

export declare type $TaskλShape = $.typeutil.flatten<$TimestampsλShape & {
  "dueAt": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, false>;
  "title": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "hasNotification": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, true, false, false>;
  "status": $.PropertyDesc<$TaskStatus, $.Cardinality.AtMostOne, false, true, false, false>;
  "assignees": $.LinkDesc<$User, $.Cardinality.AtLeastOne, {}, false, false,  false, false>;
  "lastNotificationEvent": $.LinkDesc<$TaskNotificationEvent, $.Cardinality.AtMostOne, {}, false, true,  false, false>;
  "lastSeenEvent": $.LinkDesc<$TaskSeenEvent, $.Cardinality.AtMostOne, {}, false, true,  false, false>;
  "lastAction": $.LinkDesc<$TaskAction, $.Cardinality.AtMostOne, {}, false, true,  false, false>;
  "<task[is TaskNotificationEvent]": $.LinkDesc<$TaskNotificationEvent, $.Cardinality.Many, {}, false, false,  false, false>;
  "<task[is TaskSeenEvent]": $.LinkDesc<$TaskSeenEvent, $.Cardinality.Many, {}, false, false,  false, false>;
  "<task[is TaskAction]": $.LinkDesc<$TaskAction, $.Cardinality.Many, {}, false, false,  false, false>;
  "<task[is TaskComment]": $.LinkDesc<$TaskComment, $.Cardinality.Many, {}, false, false,  false, false>;
  "<task": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
declare type $Task = $.ObjectType<"default::Task", $TaskλShape, null, [
  ...$Timestamps['__exclusives__'],
]>;
declare const $Task: $Task

declare const Task: $.$expr_PathNode<$.TypeSet<$Task, $.Cardinality.Many>, null> 

export declare type $TaskNotificationEventλShape = $.typeutil.flatten<$TimestampsλShape & {
  "task": $.LinkDesc<$Task, $.Cardinality.One, {}, false, false,  false, false>;
  "user": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  false, false>;
  "<lastNotificationEvent[is Task]": $.LinkDesc<$Task, $.Cardinality.Many, {}, false, false,  false, false>;
  "<lastNotificationEvent": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
declare type $TaskNotificationEvent = $.ObjectType<"default::TaskNotificationEvent", $TaskNotificationEventλShape, null, [
  ...$Timestamps['__exclusives__'],
]>;
declare const $TaskNotificationEvent: $TaskNotificationEvent

declare const TaskNotificationEvent: $.$expr_PathNode<$.TypeSet<$TaskNotificationEvent, $.Cardinality.Many>, null> 

export declare type $TaskActionλShape = $.typeutil.flatten<$TaskNotificationEventλShape & {
  "kind": $.PropertyDesc<$TaskActionKind, $.Cardinality.One, false, false, false, false>;
  "reason": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<lastAction[is Task]": $.LinkDesc<$Task, $.Cardinality.Many, {}, false, false,  false, false>;
  "<lastAction": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
declare type $TaskAction = $.ObjectType<"default::TaskAction", $TaskActionλShape, null, [
  ...$TaskNotificationEvent['__exclusives__'],
]>;
declare const $TaskAction: $TaskAction

declare const TaskAction: $.$expr_PathNode<$.TypeSet<$TaskAction, $.Cardinality.Many>, null> 

export declare type $TaskCommentλShape = $.typeutil.flatten<$TaskNotificationEventλShape & {
  "note": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
}>;
declare type $TaskComment = $.ObjectType<"default::TaskComment", $TaskCommentλShape, null, [
  ...$TaskNotificationEvent['__exclusives__'],
]>;
declare const $TaskComment: $TaskComment

declare const TaskComment: $.$expr_PathNode<$.TypeSet<$TaskComment, $.Cardinality.Many>, null> 

export declare type $TaskSeenEventλShape = $.typeutil.flatten<$TimestampsλShape & {
  "task": $.LinkDesc<$Task, $.Cardinality.One, {}, false, false,  false, false>;
  "user": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  false, false>;
  "<lastSeenEvent[is Task]": $.LinkDesc<$Task, $.Cardinality.Many, {}, false, false,  false, false>;
  "<lastSeenEvent": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
declare type $TaskSeenEvent = $.ObjectType<"default::TaskSeenEvent", $TaskSeenEventλShape, null, [
  ...$Timestamps['__exclusives__'],
]>;
declare const $TaskSeenEvent: $TaskSeenEvent

declare const TaskSeenEvent: $.$expr_PathNode<$.TypeSet<$TaskSeenEvent, $.Cardinality.Many>, null> 

export declare type $UserλShape = $.typeutil.flatten<_std.$Object_dd264c4250cc11ed8c36bf66839c7329λShape & {
  "familyName": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "givenName": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, true, false, false>;
  "<assignees[is Task]": $.LinkDesc<$Task, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is TaskNotificationEvent]": $.LinkDesc<$TaskNotificationEvent, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is TaskSeenEvent]": $.LinkDesc<$TaskSeenEvent, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is TaskAction]": $.LinkDesc<$TaskAction, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is TaskComment]": $.LinkDesc<$TaskComment, $.Cardinality.Many, {}, false, false,  false, false>;
  "<assignees": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
declare type $User = $.ObjectType<"default::User", $UserλShape, null, [
  ..._std.$Object_dd264c4250cc11ed8c36bf66839c7329['__exclusives__'],
]>;
declare const $User: $User

declare const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null> 

export declare type $currentUserλShape = $.typeutil.flatten<$UserλShape & {
}>;
declare type $currentUser = $.ObjectType<"default::currentUser", $currentUserλShape, null, [
  ...$User['__exclusives__'],
]>;
declare const $currentUser: $currentUser

declare const currentUser: $.$expr_PathNode<$.TypeSet<$currentUser, $.Cardinality.Many>, null> 

declare const $default__globals: {  currentUser: _.syntax.$expr_Global<
              // "default::currentUser",
              $currentUser,
              $.Cardinality.AtMostOne
              >,  currentUserId: _.syntax.$expr_Global<
              // "default::currentUserId",
              _std.$uuid,
              $.Cardinality.AtMostOne
              >}



export { TaskActionKind, TaskStatus, $Timestamps, Timestamps, $Task, Task, $TaskNotificationEvent, TaskNotificationEvent, $TaskAction, TaskAction, $TaskComment, TaskComment, $TaskSeenEvent, TaskSeenEvent, $User, User, $currentUser, currentUser };

declare type __defaultExports = {
  "TaskActionKind": typeof TaskActionKind;
  "TaskStatus": typeof TaskStatus;
  "Timestamps": typeof Timestamps;
  "Task": typeof Task;
  "TaskNotificationEvent": typeof TaskNotificationEvent;
  "TaskAction": typeof TaskAction;
  "TaskComment": typeof TaskComment;
  "TaskSeenEvent": typeof TaskSeenEvent;
  "User": typeof User;
  "currentUser": typeof currentUser;
  "global": typeof $default__globals
};
declare const __defaultExports: __defaultExports;
export default __defaultExports;
