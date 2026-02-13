import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import RecurrenceSelector from './RecurrenceSelector'
import { reminderOptions } from '../../constants/defaults'
import { formatDate } from '../../utils/dateUtils'
import styles from './TodoModal.module.css'

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  categoryId: '',
  reminder: false,
  reminderMinutes: 30,
  recurrence: null,
}

export default function TodoModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  todo,
  categories,
  selectedDate,
}) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (todo) {
      setForm({
        title: todo.title || '',
        description: todo.description || '',
        date: todo.date || '',
        time: todo.time || '',
        categoryId: todo.categoryId || '',
        reminder: todo.reminder || false,
        reminderMinutes: todo.reminderMinutes || 30,
        recurrence: todo.recurrence || null,
      })
    } else if (selectedDate) {
      const dateStr = formatDate(
        new Date(selectedDate.year, selectedDate.month, selectedDate.day)
      )
      setForm({
        ...emptyForm,
        date: dateStr,
        categoryId: categories.length > 0 ? categories[0].id : '',
      })
    } else {
      setForm({
        ...emptyForm,
        categoryId: categories.length > 0 ? categories[0].id : '',
      })
    }
  }, [todo, selectedDate, categories])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (!form.date) return

    onSave({
      ...(todo ? { id: todo.id } : {}),
      title: form.title.trim(),
      description: form.description,
      date: form.date,
      time: form.time,
      categoryId: form.categoryId,
      reminder: form.reminder,
      reminderMinutes: parseInt(form.reminderMinutes, 10),
      recurrence: form.recurrence,
    })
    onClose()
  }

  const handleDelete = () => {
    if (todo && confirm('このTodoを削除しますか？')) {
      onDelete(todo.id)
      onClose()
    }
  }

  const footer = (
    <>
      {todo && (
        <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDelete}>
          削除
        </button>
      )}
      <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>
        キャンセル
      </button>
      <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit}>
        {todo ? '更新' : '作成'}
      </button>
    </>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={todo ? 'Todoを編集' : 'Todoを作成'}
      footer={footer}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>タイトル *</label>
          <input
            className={styles.input}
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Todoのタイトル"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>メモ</label>
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="詳細メモ"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>期日 *</label>
            <input
              className={styles.input}
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>時間</label>
            <input
              className={styles.input}
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>カテゴリ</label>
          <select
            className={styles.select}
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">カテゴリなし</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.checkRow}>
            <input
              type="checkbox"
              name="reminder"
              checked={form.reminder}
              onChange={handleChange}
            />
            リマインダーを設定
          </label>
        </div>

        {form.reminder && (
          <div className={styles.field}>
            <label className={styles.label}>通知タイミング</label>
            <select
              className={styles.select}
              name="reminderMinutes"
              value={form.reminderMinutes}
              onChange={handleChange}
            >
              {reminderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>繰り返し</label>
          <RecurrenceSelector
            value={form.recurrence}
            onChange={(rec) => setForm((prev) => ({ ...prev, recurrence: rec }))}
          />
        </div>
      </form>
    </Modal>
  )
}
