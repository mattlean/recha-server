import app from './app'
import { DB, PORT } from './config'
import { createPool } from './util/db'
import { logger } from './util'

if (process.env.NODE_ENV) {
  logger.info(`Environment: ${process.env.NODE_ENV}`)
} else {
  logger.warn(`Environment: ${process.env.NODE_ENV}`)
}

createPool(DB)
app.listen(PORT, () => logger.info(`recha-server listening on port: ${PORT}`))
