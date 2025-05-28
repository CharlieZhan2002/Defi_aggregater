import React from 'react'

const chains = [
  { name: 'Ethereum', icon: '/icons/eth.png' },
  { name: 'BNB', icon: '/icons/bnb.png' },
  { name: 'Polygon', icon: '/icons/polygon.png' },
  // 继续添加你截图中的图标
]

export default function ChainFilterBar() {
  return (
    <div className="flex overflow-x-auto gap-4 py-2 px-4 bg-[#121826] rounded-xl">
      {chains.map((chain) => (
        <button
          key={chain.name}
          className="flex-shrink-0 w-10 h-10 bg-[#1E293B] rounded-full flex items-center justify-center hover:ring-2 ring-blue-400"
          title={chain.name}
        >
          <img src={chain.icon} alt={chain.name} className="w-6 h-6" />
        </button>
      ))}
    </div>
  )
}
