import { predefinedColors } from '../../constants/defaults'

export default function ColorPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      {predefinedColors.map((color) => (
        <div
          key={color}
          onClick={() => onChange(color)}
          style={{
            width: 24,
            height: 24,
            backgroundColor: color,
            borderRadius: 4,
            cursor: 'pointer',
            border: value === color ? '2px solid #333' : '2px solid transparent',
            boxShadow: '0 0 0 1px #ddd',
          }}
        />
      ))}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 28, height: 28, cursor: 'pointer', border: 'none', padding: 0 }}
      />
    </div>
  )
}
