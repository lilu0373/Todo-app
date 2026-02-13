import { useState } from 'react'
import ViewToggle from '../common/ViewToggle'
import styles from './Sidebar.module.css'

export default function Sidebar({
  viewMode,
  onViewChange,
  categories,
  todos,
  selectedCategoryIds,
  onCategoryToggle,
  onNewTodo,
  onManageCategories,
  onOpenReminders,
  reminderCount,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const getCount = (catId) =>
    todos.filter((t) => !t.completed && t.categoryId === catId).length

  const allActiveCount = todos.filter((t) => !t.completed).length

  const sidebarClass = `${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`

  return (
    <>
      <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}>
        ☰
      </button>

      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      <aside className={sidebarClass}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✓</span>
          Todoアプリ
        </div>

        <button className={styles.newBtn} onClick={() => { onNewTodo(); setMobileOpen(false) }}>
          + 新しいTodo
        </button>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>表示切替</div>
          <ViewToggle mode={viewMode} onToggle={onViewChange} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>カテゴリ</div>
          <div className={styles.categoryList}>
            <button
              className={`${styles.categoryRow} ${selectedCategoryIds.length === 0 ? styles.categoryRowActive : ''}`}
              onClick={() => onCategoryToggle(null)}
            >
              <span className={styles.categoryDot} style={{ background: '#999' }} />
              <span className={styles.categoryName}>すべて</span>
              <span className={styles.categoryCount}>{allActiveCount}</span>
            </button>

            {categories.map((cat) => {
              const active = selectedCategoryIds.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  className={`${styles.categoryRow} ${active ? styles.categoryRowActive : ''}`}
                  onClick={() => onCategoryToggle(cat.id)}
                >
                  <span className={styles.categoryDot} style={{ background: cat.color }} />
                  <span className={styles.categoryName}>{cat.name}</span>
                  <span className={styles.categoryCount}>{getCount(cat.id)}</span>
                </button>
              )
            })}
          </div>
          <button className={styles.manageLink} onClick={onManageCategories}>
            カテゴリ管理
          </button>
        </div>

        <button className={styles.reminderBtn} onClick={onOpenReminders}>
          🔔 リマインダー
          {reminderCount > 0 && <span className={styles.badge}>{reminderCount}</span>}
        </button>
      </aside>
    </>
  )
}
