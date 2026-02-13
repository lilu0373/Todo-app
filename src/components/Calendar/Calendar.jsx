import { useState, useMemo } from 'react'
import { generateCalendarDays, getToday, getMonthName, formatDate } from '../../utils/dateUtils'
import CalendarDay from './CalendarDay'
import styles from './Calendar.module.css'

const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土']

export default function Calendar({ todos, onDayClick, onTodoClick, getCategoryColor }) {
  const today = getToday()
  const [currentYear, setCurrentYear] = useState(today.year)
  const [currentMonth, setCurrentMonth] = useState(today.month)

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToToday = () => {
    setCurrentYear(today.year)
    setCurrentMonth(today.month)
  }

  const days = useMemo(
    () => generateCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  )

  const getTodosForDay = (year, month, day) => {
    const dateStr = formatDate(new Date(year, month, day))
    return todos.filter((t) => t.date === dateStr)
  }

  const isToday = (year, month, day) =>
    year === today.year && month === today.month && day === today.day

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.monthLabel}>
          {currentYear}年 {getMonthName(currentMonth)}
        </h2>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={goToPreviousMonth}>
            ← 前月
          </button>
          <button className={styles.navBtn} onClick={goToToday}>
            今日
          </button>
          <button className={styles.navBtn} onClick={goToNextMonth}>
            次月 →
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {DAY_NAMES.map((name, i) => (
          <div
            key={i}
            className={`${styles.dayHeader} ${i === 0 ? styles.dayHeaderSun : ''} ${i === 6 ? styles.dayHeaderSat : ''}`}
          >
            {name}
          </div>
        ))}

        {days.map((dayInfo, i) => (
          <CalendarDay
            key={i}
            dayInfo={dayInfo}
            isToday={isToday(dayInfo.year, dayInfo.month, dayInfo.day)}
            dayOfWeek={i % 7}
            todos={getTodosForDay(dayInfo.year, dayInfo.month, dayInfo.day)}
            getCategoryColor={getCategoryColor}
            onDayClick={onDayClick}
            onTodoClick={onTodoClick}
          />
        ))}
      </div>
    </div>
  )
}
