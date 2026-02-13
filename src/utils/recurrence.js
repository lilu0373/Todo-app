import { addDays, addWeeks, addMonths, formatDate, parseDate } from './dateUtils'

function getNextDate(date, type, interval) {
  switch (type) {
    case 'daily':
      return addDays(date, interval)
    case 'weekly':
      return addWeeks(date, interval)
    case 'monthly':
      return addMonths(date, interval)
    default:
      return null
  }
}

export function expandRecurrences(templateTodo, rangeStart, rangeEnd) {
  const rec = templateTodo.recurrence
  if (!rec || rec.parentId) return []

  const results = []
  const endDate = rec.endDate ? parseDate(rec.endDate) : null
  let current = parseDate(templateTodo.date)
  let count = 0
  const MAX_OCCURRENCES = 100

  while (count < MAX_OCCURRENCES) {
    if (endDate && current > endDate) break
    if (current > rangeEnd) break

    if (current >= rangeStart) {
      const dateStr = formatDate(current)
      if (dateStr !== templateTodo.date) {
        results.push({
          ...templateTodo,
          id: `${templateTodo.id}_${dateStr}`,
          date: dateStr,
          completed: false,
          completedAt: null,
          recurrence: { ...rec, parentId: templateTodo.id },
        })
      }
    }

    current = getNextDate(current, rec.type, rec.interval)
    if (!current) break
    count++
  }

  return results
}

export function expandAllForMonth(todos, year, month) {
  const rangeStart = new Date(year, month, 1)
  const rangeEnd = new Date(year, month + 1, 0)

  const expanded = []
  const concreteIds = new Set()

  // Collect concrete instances (completed recurrences)
  todos.forEach((t) => {
    if (t.recurrence?.parentId) {
      concreteIds.add(`${t.recurrence.parentId}_${t.date}`)
    }
  })

  todos.forEach((t) => {
    if (t.recurrence && !t.recurrence.parentId) {
      const occurrences = expandRecurrences(t, rangeStart, rangeEnd)
      occurrences.forEach((occ) => {
        if (!concreteIds.has(occ.id)) {
          expanded.push(occ)
        }
      })
    }
  })

  return [...todos, ...expanded]
}

export function expandAllForDays(todos, startDate, dayCount) {
  const rangeStart = new Date(startDate)
  const rangeEnd = new Date(startDate)
  rangeEnd.setDate(rangeEnd.getDate() + dayCount)

  const expanded = []
  const concreteIds = new Set()

  todos.forEach((t) => {
    if (t.recurrence?.parentId) {
      concreteIds.add(`${t.recurrence.parentId}_${t.date}`)
    }
  })

  todos.forEach((t) => {
    if (t.recurrence && !t.recurrence.parentId) {
      const occurrences = expandRecurrences(t, rangeStart, rangeEnd)
      occurrences.forEach((occ) => {
        if (!concreteIds.has(occ.id)) {
          expanded.push(occ)
        }
      })
    }
  })

  return [...todos, ...expanded]
}
