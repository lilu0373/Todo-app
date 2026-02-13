import { useMemo } from 'react'
import { getRelativeDateLabel, formatDate } from '../../utils/dateUtils'
import TodoItem from './TodoItem'
import styles from './TodoList.module.css'

export default function TodoList({
  todos,
  getCategoryColor,
  getCategoryName,
  onToggle,
  onTodoClick,
}) {
  const grouped = useMemo(() => {
    const sorted = [...todos].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      return a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '')
    })

    const groups = []
    const map = new Map()

    sorted.forEach((todo) => {
      const key = todo.date || 'no-date'
      if (!map.has(key)) {
        const group = { date: key, todos: [] }
        map.set(key, group)
        groups.push(group)
      }
      map.get(key).todos.push(todo)
    })

    return groups
  }, [todos])

  const todayStr = formatDate(new Date())

  if (todos.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📝</div>
        <p>Todoがありません</p>
        <p style={{ marginTop: 4 }}>「+ 新しいTodo」からTodoを追加してください</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {grouped.map((group) => (
        <div key={group.date} className={styles.dateGroup}>
          <div
            className={`${styles.dateHeader} ${group.date === todayStr ? styles.dateHeaderToday : ''}`}
          >
            {group.date === 'no-date' ? '期限なし' : getRelativeDateLabel(group.date)}
          </div>
          <div className={styles.items}>
            {group.todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                getCategoryColor={getCategoryColor}
                getCategoryName={getCategoryName}
                onToggle={onToggle}
                onClick={onTodoClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
