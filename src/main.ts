import app from './app'
import { API, PORT } from './config'
import { logger } from './util'

if (process.env.NODE_ENV) {
  logger.info(`Environment: ${process.env.NODE_ENV}`)
} else {
  logger.warn(`Environment: ${process.env.NODE_ENV}`)
}

app.listen(PORT, () => logger.info(`${API.NAME} listening on port: ${PORT}`))
