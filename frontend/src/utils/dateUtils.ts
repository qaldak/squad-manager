import { format } from 'date-fns'

export function getDate(dateIn: Date) {
    console.log(dateIn)
    console.log(format(dateIn, 'dd/mm/yyyy'))
    return format(dateIn, 'dd/mm/yyyy')
}