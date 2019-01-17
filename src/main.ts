import app from './app'
import { logger } from './util'

app.listen(9001, () => logger.info('recha-server listening on port: 9001'))

// const { DB_URI, PORT } = require('./config')
// const { db, logger } = require('./util')

// if (process.env.NODE_ENV) {
//   logger.info(`Environment: ${process.env.NODE_ENV}`)
// } else {
//   logger.warn(`Environment: ${process.env.NODE_ENV}`)
// }

// db.connect(DB_URI)
//   .then(() => {
//     const app = require('./app') // eslint-disable-line global-require

//     app.listen(PORT, () => logger.info(`Server listening on port: ${PORT}`))
//   })
//   .catch(err => logger.error(err))
