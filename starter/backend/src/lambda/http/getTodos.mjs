import { getToDoList } from '../../dataLayer/dbAccess.mjs'
import { getUserId } from '../utils.mjs'
import { useMiddleware } from '../../middleware/middy.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('todos')

export const handler = useMiddleware(async (event) => {
  const userId = getUserId(event)

  const items = await getToDoList(userId)

  logger.info('getting todo list for user', { userId })

  return {
    statusCode: 200,
    body: JSON.stringify({
      items
    })
  }
})
