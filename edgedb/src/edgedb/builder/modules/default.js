"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
const $ = __importStar(require("../reflection"));
const _ = __importStar(require("../imports"));
const TaskActionKind = $.makeType(_.spec, "a240d003-5859-11ed-b28f-51c82f30903d", _.syntax.literal);

const TaskStatus = $.makeType(_.spec, "a240dfe1-5859-11ed-aca2-1b78d7bd8342", _.syntax.literal);

const $Timestamps = $.makeType(_.spec, "a23d8158-5859-11ed-91c9-4b4fadb4f40c", _.syntax.literal);

const Timestamps= _.syntax.$PathNode($.$toSet($Timestamps, $.Cardinality.Many), null);

const $Task = $.makeType(_.spec, "a2411c12-5859-11ed-bd6a-67913e7fc0cd", _.syntax.literal);

const Task= _.syntax.$PathNode($.$toSet($Task, $.Cardinality.Many), null);

const $TaskNotificationEvent = $.makeType(_.spec, "a243b433-5859-11ed-9ad2-f117bd8aa9ac", _.syntax.literal);

const TaskNotificationEvent= _.syntax.$PathNode($.$toSet($TaskNotificationEvent, $.Cardinality.Many), null);

const $TaskAction = $.makeType(_.spec, "a2681299-5859-11ed-a281-379e1047063f", _.syntax.literal);

const TaskAction= _.syntax.$PathNode($.$toSet($TaskAction, $.Cardinality.Many), null);

const $TaskComment = $.makeType(_.spec, "a28c3ef5-5859-11ed-83db-c30cf49421b4", _.syntax.literal);

const TaskComment= _.syntax.$PathNode($.$toSet($TaskComment, $.Cardinality.Many), null);

const $TaskSeenEvent = $.makeType(_.spec, "a2509dbc-5859-11ed-b470-279d2b741f50", _.syntax.literal);

const TaskSeenEvent= _.syntax.$PathNode($.$toSet($TaskSeenEvent, $.Cardinality.Many), null);

const $User = $.makeType(_.spec, "a235485e-5859-11ed-bb0e-d54feec41307", _.syntax.literal);

const User= _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null);

const $currentUser = $.makeType(_.spec, "a23d1208-5859-11ed-a118-2d874e990ee2", _.syntax.literal);

const currentUser= _.syntax.$PathNode($.$toSet($currentUser, $.Cardinality.Many), null);

const $default__globals = {  currentUser: _.syntax.makeGlobal(
              "default::currentUser",
              $.makeType(_.spec, "a23d1208-5859-11ed-a118-2d874e990ee2", _.syntax.literal),
              $.Cardinality.AtMostOne),  currentUserId: _.syntax.makeGlobal(
              "default::currentUserId",
              $.makeType(_.spec, "00000000-0000-0000-0000-000000000100", _.syntax.literal),
              $.Cardinality.AtMostOne)};



Object.assign(exports, { TaskActionKind: TaskActionKind, TaskStatus: TaskStatus, $Timestamps: $Timestamps, Timestamps: Timestamps, $Task: $Task, Task: Task, $TaskNotificationEvent: $TaskNotificationEvent, TaskNotificationEvent: TaskNotificationEvent, $TaskAction: $TaskAction, TaskAction: TaskAction, $TaskComment: $TaskComment, TaskComment: TaskComment, $TaskSeenEvent: $TaskSeenEvent, TaskSeenEvent: TaskSeenEvent, $User: $User, User: User, $currentUser: $currentUser, currentUser: currentUser });

const __defaultExports = {
  "TaskActionKind": TaskActionKind,
  "TaskStatus": TaskStatus,
  "Timestamps": Timestamps,
  "Task": Task,
  "TaskNotificationEvent": TaskNotificationEvent,
  "TaskAction": TaskAction,
  "TaskComment": TaskComment,
  "TaskSeenEvent": TaskSeenEvent,
  "User": User,
  "currentUser": currentUser,
  "global": $default__globals
};
exports.default = __defaultExports;
