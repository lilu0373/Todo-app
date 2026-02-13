const btnBase = {
  padding: '6px 16px',
  border: 'none',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 20,
  transition: 'all 0.2s',
  cursor: 'pointer',
}

export default function ViewToggle({ mode, onToggle }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: '#f0f0f0', borderRadius: 20, padding: 3 }}>
      <button
        style={{
          ...btnBase,
          background: mode === 'calendar' ? 'var(--color-primary)' : 'transparent',
          color: mode === 'calendar' ? '#fff' : 'var(--color-text-secondary)',
        }}
        onClick={() => onToggle('calendar')}
      >
        カレンダー
      </button>
      <button
        style={{
          ...btnBase,
          background: mode === 'list' ? 'var(--color-primary)' : 'transparent',
          color: mode === 'list' ? '#fff' : 'var(--color-text-secondary)',
        }}
        onClick={() => onToggle('list')}
      >
        リスト
      </button>
    </div>
  )
}
