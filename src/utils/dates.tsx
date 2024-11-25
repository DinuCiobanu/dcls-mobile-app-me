import moment from 'moment'

export const monthNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const getDiffByNow = (date: string) => {
  return moment().diff(moment(date, 'DD-MM-YYYY HH:mm:ss'), 'seconds')
}

export const getParsedTimerString = (duration: string) => {
  return moment(duration, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds')
}

export const getTimerString = (seconds: number) => {
  return moment.utc(1000 * seconds).format('HH:mm:ss')
}
