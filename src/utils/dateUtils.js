export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1)
}

export function getLastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0)
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getDayOfWeek(year, month, day) {
  return new Date(year, month, day).getDay()
}

export function getToday() {
  const today = new Date()
  return {
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  }
}

export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDateTime(date) {
  const dateStr = formatDate(date)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${dateStr}T${hours}:${minutes}`
}

export function generateCalendarDays(year, month) {
  const daysInMonth = getDaysInMonth(year, month)
  const startDayOfWeek = getFirstDayOfMonth(year, month).getDay()
  const days = []

  const prevMonthDays = getDaysInMonth(
    month === 0 ? year - 1 : year,
    month === 0 ? 11 : month - 1
  )

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      isOtherMonth: true,
    })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ day, month, year, isOtherMonth: false })
  }

  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      isOtherMonth: true,
    })
  }

  return days
}

export function getMonthName(month) {
  return `${month + 1}月`
}

export function getDayName(dayOfWeek) {
  const dayNames = ['日', '月', '火', '水', '木', '金', '土']
  return dayNames[dayOfWeek]
}

export function addDays(date, n) {
  const result = new Date(date)
  result.setDate(result.getDate() + n)
  return result
}

export function addWeeks(date, n) {
  return addDays(date, n * 7)
}

export function addMonths(date, n) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + n)
  return result
}

export function isDateInRange(date, start, end) {
  const d = date.getTime()
  return d >= start.getTime() && d <= end.getTime()
}

export function getRelativeDateLabel(dateString) {
  const today = new Date()
  const target = parseDate(dateString)
  const todayStr = formatDate(today)
  const tomorrowStr = formatDate(addDays(today, 1))
  const yesterdayStr = formatDate(addDays(today, -1))

  if (dateString === todayStr) return '今日'
  if (dateString === tomorrowStr) return '明日'
  if (dateString === yesterdayStr) return '昨日'

  const month = target.getMonth() + 1
  const day = target.getDate()
  const dayNames = ['日', '月', '火', '水', '木', '金', '土']
  const dow = dayNames[target.getDay()]
  return `${month}月${day}日(${dow})`
}
