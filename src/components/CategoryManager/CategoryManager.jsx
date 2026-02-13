import { useState } from 'react'
import Modal from '../common/Modal'
import ColorPicker from '../common/ColorPicker'
import styles from './CategoryManager.module.css'

export default function CategoryManager({
  isOpen,
  onClose,
  categories,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#4a90e2')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), color)
    setName('')
    setColor('#4a90e2')
  }

  const handleDelete = (id) => {
    if (confirm('このカテゴリを削除しますか？')) {
      onDelete(id)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="カテゴリ管理"
      footer={
        <button className={styles.closeBtn} onClick={onClose}>
          閉じる
        </button>
      }
    >
      <form onSubmit={handleAdd}>
        <div className={styles.addForm}>
          <input
            className={styles.addInput}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="カテゴリ名"
          />
          <button type="submit" className={styles.addBtn}>
            追加
          </button>
        </div>
      </form>

      <div className={styles.colorSection}>
        <div className={styles.colorLabel}>カラー選択</div>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <div className={styles.list}>
        <div className={styles.listTitle}>登録済みカテゴリ</div>
        {categories.length === 0 ? (
          <p className={styles.emptyMsg}>カテゴリがまだありません</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className={styles.item}>
              <input
                type="color"
                value={cat.color}
                onChange={(e) => onUpdate(cat.id, { color: e.target.value })}
                className={styles.colorInput}
              />
              <input
                type="text"
                value={cat.name}
                onChange={(e) => onUpdate(cat.id, { name: e.target.value })}
                className={styles.nameInput}
              />
              <button className={styles.deleteBtn} onClick={() => handleDelete(cat.id)}>
                削除
              </button>
            </div>
          ))
        )}
      </div>
    </Modal>
  )
}
