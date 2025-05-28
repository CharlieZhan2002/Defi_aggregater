import { useState } from 'react'

export default function MinimumTvlSlider() {
  const [value, setValue] = useState(0)

  return (
    <div className="flex items-center gap-2 bg-[#1e293b] px-4 py-2 rounded-xl w-full md:w-fit text-white">
      <span className="text-sm text-slate-300">Minimum TVL:</span>
      <input
        type="range"
        min="0"
        max="1000000"
        step="10000"
        value={value}
        onChange={e => setValue(parseInt(e.target.value))}
        className="accent-blue-500 w-40"
      />
      <span className="text-xs text-slate-400 min-w-[60px] text-right">
        ${value.toLocaleString()}
      </span>
    </div>
  )
}
