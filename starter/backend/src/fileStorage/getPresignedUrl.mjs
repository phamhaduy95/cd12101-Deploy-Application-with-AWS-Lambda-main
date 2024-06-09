import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client()

const BUCKET_NAME = process.env.ATTACHMENT_S3_BUCKET
const SIGNED_URL_EXPIRATION = process.env.SIGNED_URL_EXPIRATION

export const getPresignedUrl = async (key) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  })

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: SIGNED_URL_EXPIRATION
  })

  return uploadUrl
}
