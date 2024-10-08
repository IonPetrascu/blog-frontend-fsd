export const transformToLocalTime = (isoString: string) => {
  const date = new Date(isoString)
  const allMonth = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const day = date.getUTCDate()
  const month = allMonth[date.getUTCMonth()]
  const hour = date.getUTCHours()
  const minute = date.getUTCMinutes()

  return `${day} ${month}, ${hour}:${minute}`
}
