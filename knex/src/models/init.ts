import { AllModels } from './BaseModel'
import { Task } from './Task'
import { TaskAction } from './TaskAction'
import { TaskComment } from './TaskComment'
import { TaskNotificationEvent } from './TaskNotificationEvent'
import { TaskSeenEvent } from './TaskSeenEvent'
import { User } from './User'

export const initModel = () => {
  // WORKAROUND: every new model should get added to this list because of problems with objection relations due to Next
  AllModels.Task = Task
  AllModels.TaskAction = TaskAction
  AllModels.TaskComment = TaskComment
  AllModels.TaskNotificationEvent = TaskNotificationEvent
  AllModels.TaskSeenEvent = TaskSeenEvent
  AllModels.User = User
}
