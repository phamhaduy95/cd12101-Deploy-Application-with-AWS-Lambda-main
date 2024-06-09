import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { useMiddleware } from '../../middleware/middy.mjs'
import { addAttachment } from '../../dataLayer/dbAccess.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const logger = createLogger('attachment')

const s3Client = new S3Client()

const BUCKET_NAME = process.env.ATTACHMENT_S3_BUCKET
const SIGNED_URL_EXPIRATION = process.env.SIGNED_URL_EXPIRATION

export const handler = useMiddleware(async (event) => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const { ext } = JSON.parse(event.body)

  const key = todoId.concat(!!ext ? `.${ext}` : '')

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  })

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: SIGNED_URL_EXPIRATION
  })

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
