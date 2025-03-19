import { format } from 'date-fns'
import log from 'loglevel'

export function getDate(dateIn: Date) {
  log.debug(`get formated date for ${dateIn} -->  ${format(dateIn, 'dd/mm/yyyy')}`)
  return format(dateIn, 'dd/mm/yyyy')
}
