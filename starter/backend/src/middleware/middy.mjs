import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

export const useMiddleware = (handler) =>
  middy()
    .use(httpErrorHandler())
    .use(
      cors({
        credentials: true
      })
    )
    .handler(handler)
