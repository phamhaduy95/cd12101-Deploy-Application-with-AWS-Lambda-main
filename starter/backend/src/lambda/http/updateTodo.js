import { updateToDo } from '../../dataLayer/dbAccess.mjs'
import { getUserId } from '../utils.mjs'
import { useMiddleware } from '../../middleware/middy'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('todos')

export const handler = useMiddleware(async (event) => {
  const todoId = event.pathParameters.todoId
  const body = JSON.parse(event.body)
  const userId = getUserId(event)

  await updateToDo(userId, todoId, body)

  logger.info('todo is updated', { todoId, body })

  return {
    statusCode: 200,
    body: JSON.stringify({
      todoId
    })
  }
})
