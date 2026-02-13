import { recurrenceTypes } from '../../constants/defaults'

export default function RecurrenceSelector({ value, onChange }) {
  const type = value?.type || 'none'
  const interval = value?.interval || 1
  const endDate = value?.endDate || ''

  const handleTypeChange = (e) => {
    const newType = e.target.value
    if (newType === 'none') {
      onChange(null)
    } else {
      onChange({ type: newType, interval, endDate: endDate || null, parentId: null })
    }
  }

  const handleIntervalChange = (e) => {
    onChange({ ...value, interval: parseInt(e.target.value, 10) || 1 })
  }

  const handleEndDateChange = (e) => {
    onChange({ ...value, endDate: e.target.value || null })
  }

  const unitLabel = type === 'daily' ? '日' : type === 'weekly' ? '週' : '月'

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={type} onChange={handleTypeChange} style={selectStyle}>
          {recurrenceTypes.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        {type !== 'none' && (
          <>
            <span style={{ fontSize: 14, color: '#666' }}>間隔:</span>
            <input
              type="number"
              min={1}
              max={365}
              value={interval}
              onChange={handleIntervalChange}
              style={{ ...inputStyle, width: 60 }}
            />
            <span style={{ fontSize: 14, color: '#666' }}>{unitLabel}ごと</span>
          </>
        )}
      </div>

      {type !== 'none' && (
        <div style={{ marginTop: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: '#666' }}>終了日:</span>
          <input
            type="date"
            value={endDate || ''}
            onChange={handleEndDateChange}
            style={inputStyle}
          />
          <span style={{ fontSize: 12, color: '#999' }}>(任意)</span>
        </div>
      )}
    </div>
  )
}

const selectStyle = {
  padding: '6px 10px',
  border: '1px solid #ddd',
  borderRadius: 4,
  fontSize: 14,
}

const inputStyle = {
  padding: '6px 10px',
  border: '1px solid #ddd',
  borderRadius: 4,
  fontSize: 14,
}
