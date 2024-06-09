import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { useMiddleware } from '../../middleware/middy'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('attachment')

const s3Client = new S3Client()

const BUCKET_NAME = process.env.ATTACHMENT_S3_BUCKET
const SIGNED_URL_EXPIRATION = process.env.SIGNED_URL_EXPIRATION

export const handler = useMiddleware(async (event) => {
  const attachmentUrl = event.pathParameters.todoId

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: attachmentUrl
  })

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: SIGNED_URL_EXPIRATION
  })

  logger.info('upload url is generated', { uploadUrl })

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
  }
})
