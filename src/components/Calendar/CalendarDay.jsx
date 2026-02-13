import styles from './Calendar.module.css'

const MAX_VISIBLE = 3

export default function CalendarDay({
  dayInfo,
  isToday,
  dayOfWeek,
  todos,
  getCategoryColor,
  onDayClick,
  onTodoClick,
}) {
  const dayClasses = [
    styles.day,
    dayInfo.isOtherMonth && styles.dayOtherMonth,
  ]
    .filter(Boolean)
    .join(' ')

  const visible = todos.slice(0, MAX_VISIBLE)
  const overflow = todos.length - MAX_VISIBLE

  const sunClass = !isToday && dayOfWeek === 0 ? styles.dayNumberSun : ''
  const satClass = !isToday && dayOfWeek === 6 ? styles.dayNumberSat : ''

  return (
    <div className={dayClasses} onClick={() => onDayClick(dayInfo.year, dayInfo.month, dayInfo.day)}>
      <div className={`${styles.dayNumber} ${sunClass} ${satClass}`}>
        {isToday ? <span className={styles.dayNumberToday}>{dayInfo.day}</span> : dayInfo.day}
      </div>
      <div className={styles.todos}>
        {visible.map((todo) => (
          <div
            key={todo.id}
            className={`${styles.todoChip} ${todo.completed ? styles.todoChipCompleted : ''}`}
            style={{ backgroundColor: getCategoryColor(todo.categoryId) }}
            onClick={(e) => {
              e.stopPropagation()
              onTodoClick(todo)
            }}
            title={todo.title}
          >
            {todo.title}
          </div>
        ))}
        {overflow > 0 && <div className={styles.moreLabel}>+{overflow}件</div>}
      </div>
    </div>
  )
}
