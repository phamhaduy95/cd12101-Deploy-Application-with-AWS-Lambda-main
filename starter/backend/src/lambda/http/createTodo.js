import { getUserId } from '../utils.mjs'
import { createToDo } from '../../dataLayer/dbAccess.mjs'
import { v4 as uuidv4 } from 'uuid'
import { useMiddleware } from '../../middleware/middy'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('todos')

export const handler = useMiddleware(async (event) => {
  const newTodo = JSON.parse(event.body)
  const userId = getUserId(event)
  const newTodoId = uuidv4()
  const createAt = new Date().toISOString()

  const newTodoObj = { ...newTodo, todoId: newTodoId, userId, createAt }

  await createToDo(newTodo)

  logger.info('todo is created', { todo: newTodo })

  return {
    statusCode: 201,
    body: JSON.stringify({
      items: newTodoObj
    })
  }
})
