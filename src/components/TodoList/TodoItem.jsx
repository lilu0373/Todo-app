import styles from './TodoList.module.css'

export default function TodoItem({ todo, getCategoryColor, getCategoryName, onToggle, onClick }) {
  return (
    <div className={styles.item} onClick={() => onClick(todo)}>
      <button
        className={`${styles.checkbox} ${todo.completed ? styles.checkboxDone : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onToggle(todo.id)
        }}
        style={!todo.completed ? { borderColor: getCategoryColor(todo.categoryId) } : {}}
      >
        {todo.completed && '✓'}
      </button>

      {todo.categoryId && (
        <span
          className={styles.categoryDot}
          style={{ background: getCategoryColor(todo.categoryId) }}
        />
      )}

      <div className={styles.content}>
        <div className={`${styles.title} ${todo.completed ? styles.titleDone : ''}`}>
          {todo.title}
        </div>
        <div className={styles.meta}>
          {todo.time && <span>{todo.time}</span>}
          {todo.categoryId && (
            <span>{getCategoryName(todo.categoryId)}</span>
          )}
          {todo.recurrence && <span className={styles.metaIcon}>🔁</span>}
          {todo.reminder && <span className={styles.metaIcon}>🔔</span>}
        </div>
      </div>
    </div>
  )
}
