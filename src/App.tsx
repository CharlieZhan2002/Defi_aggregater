import './App.css'
import { VaultCardList } from './components/VaultCardList';
import ChainFilterBar from './components/ChainFilterBar'
import CategoryFilterBar from './components/CategoryFilterBar'
import MinimumTvlSlider from './components/MinimumTvlSlider'
import { useState } from 'react'

function App() {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('')

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 space-y-4">
      <ChainFilterBar />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CategoryFilterBar />
        <MinimumTvlSlider />
      </div>


      {/* 🧾 卡片列表 */}
      <VaultCardList search={search} sort={sortField} />
    </div>
  )
}


export default App