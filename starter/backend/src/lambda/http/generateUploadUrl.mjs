import { useMiddleware } from '../../middleware/middy.mjs'
import { addAttachment } from '../../dataLayer/dbAccess.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'
import { getPresignedUrl } from '../../fileStorage/getPresignedUrl.mjs'

const logger = createLogger('attachment')
const BUCKET_NAME = process.env.ATTACHMENT_S3_BUCKET

export const handler = useMiddleware(async (event) => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const { ext } = JSON.parse(event.body)

  const key = todoId.concat(!!ext ? `.${ext}` : '')

  const uploadUrl = await getPresignedUrl(key)

  logger.info('upload url is generated', { uploadUrl })

  const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`

  logger.info('imageURL is added to DB', { imageUrl })

  await addAttachment(userId, todoId, imageUrl)

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
  }
})
