import moment from 'moment'
import { createLogger, format, transports } from 'winston'

const { printf } = format

const customFormat = printf(info => `[${moment().format('YYYY-MM-DD HH:MM:SS')}] <${info.level}> | ${info.message}`)

const logger = createLogger({
  level: 'debug',
  format: customFormat,
  transports: [new transports.Console()]
})

export default logger
