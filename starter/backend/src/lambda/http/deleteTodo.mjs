import { getUserId } from '../utils.mjs'
import { deleteToDo } from '../../dataLayer/dbAccess.mjs'
import { useMiddleware } from '../../middleware/middy.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('todos')

export const handler = useMiddleware(async (event) => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  await deleteToDo(userId, todoId)

  logger.info('todo is deleted', { todoId })

  return {
    statusCode: 200,
    body: JSON.stringify({
      todoId: todoId
    })
  }
})
