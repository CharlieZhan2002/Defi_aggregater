import { useState } from 'react'

const categories = ['Stablecoins', 'Blue Chips', 'Memes', 'Correlated']

export default function CategoryFilterBar() {
  const [selected, setSelected] = useState<string | null>(null)

  const handleClick = (cat: string) => {
    setSelected(cat === selected ? null : cat)
  }

  return (
    <div className="flex gap-3 p-2 bg-[#1e293b] rounded-xl w-fit">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`px-4 py-1 rounded-full text-sm transition ${
            selected === cat
              ? 'bg-blue-600 text-white'
              : 'bg-transparent text-slate-300 hover:text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
