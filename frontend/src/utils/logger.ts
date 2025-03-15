import log from 'loglevel'

export const initLoglevel = (): void => {
  const loglevel = import.meta.env.VITE_LOG_LEVEL || 'warn'
  log.setDefaultLevel(loglevel)

  log.debug('Logger initialized with log level: ', log.getLevel())
}
