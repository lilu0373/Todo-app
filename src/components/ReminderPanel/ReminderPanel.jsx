import Modal from '../common/Modal'
import styles from './ReminderPanel.module.css'

function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${date.getMonth() + 1}月${date.getDate()}日 ${h}:${m}`
}

function getTimeUntil(hoursUntil) {
  if (hoursUntil < 0) return '通知時刻を過ぎています'
  if (hoursUntil < 1) {
    const minutes = Math.floor(hoursUntil * 60)
    return `${minutes}分後`
  }
  const hours = Math.floor(hoursUntil)
  const minutes = Math.floor((hoursUntil - hours) * 60)
  return minutes > 0 ? `${hours}時間${minutes}分後` : `${hours}時間後`
}

export default function ReminderPanel({ isOpen, onClose, reminders, getCategoryColor }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="リマインダー"
      footer={
        <button className={styles.closeBtn} onClick={onClose}>
          閉じる
        </button>
      }
    >
      <p className={styles.info}>今から24時間以内のリマインダーを表示しています</p>

      {reminders.length === 0 ? (
        <div className={styles.empty}>リマインダーはありません</div>
      ) : (
        <div className={styles.list}>
          {reminders.map((r, i) => (
            <div
              key={i}
              className={styles.item}
              style={{ borderLeftColor: getCategoryColor(r.todo.categoryId) }}
            >
              <div className={styles.itemTitle}>{r.todo.title}</div>
              <div className={styles.itemTime}>
                Todo期日: {formatTime(r.todoDate)}
              </div>
              <div className={styles.itemTime}>
                リマインダー: {formatTime(r.reminderTime)} ({getTimeUntil(r.hoursUntil)})
              </div>
              {r.todo.description && (
                <div className={styles.itemDesc}>{r.todo.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
