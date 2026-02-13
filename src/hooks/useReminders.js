import { useState, useEffect } from 'react'

export function useReminders(todos) {
  const [upcomingReminders, setUpcomingReminders] = useState([])

  useEffect(() => {
    const check = () => {
      const now = new Date()
      const reminders = []

      todos.forEach((todo) => {
        if (!todo.reminder || todo.completed) return

        const todoDate = todo.time
          ? new Date(`${todo.date}T${todo.time}`)
          : new Date(todo.date + 'T23:59:59')

        const reminderTime = new Date(
          todoDate.getTime() - todo.reminderMinutes * 60 * 1000
        )

        const diff = reminderTime.getTime() - now.getTime()
        const hoursUntil = diff / (1000 * 60 * 60)

        if (hoursUntil > -1 && hoursUntil <= 24) {
          reminders.push({ todo, reminderTime, todoDate, hoursUntil })
        }
      })

      reminders.sort((a, b) => a.reminderTime.getTime() - b.reminderTime.getTime())
      setUpcomingReminders(reminders)
    }

    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [todos])

  return { upcomingReminders, reminderCount: upcomingReminders.length }
}
