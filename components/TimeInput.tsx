'use client'

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export default function TimeInput({ value, onChange, label = '选择时间' }: TimeInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-stone-500 uppercase tracking-widest">{label}</label>
      <input
        type="datetime-local"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-stone-800 border border-stone-700 text-stone-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
      />
    </div>
  )
}
