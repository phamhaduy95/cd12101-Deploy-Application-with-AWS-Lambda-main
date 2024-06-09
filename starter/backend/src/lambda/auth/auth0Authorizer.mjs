import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl =
  'https://dev-z1jrm828yew3mvnf.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    logger.info('User authenticated', { userId: jwtToken.sub })

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)

  const cert = await generateCertificate(token)

  logger.info('certificate', { cert })

  const payload = jsonwebtoken.verify(token, cert, { algorithms: ['RS256'] })
  return payload
}

async function generateCertificate(token) {
  const jwt = jsonwebtoken.decode(token, { complete: true })

  const response = await Axios.get(jwksUrl)

  const { keys } = response.data

  const signingKey = keys.find((key) => key.kid === jwt.header.kid)

  const certData = signingKey?.x5c[0] || ''

  const cert = '-----BEGIN CERTIFICATE-----\n'
    .concat(certData)
    .concat('\n-----END CERTIFICATE-----')

  return cert
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
