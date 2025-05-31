import './App.css';
import { useState } from 'react';

import ChainFilterBar from './components/ChainFilterBar';
import CategoryFilterBar from './components/CategoryFilterBar';
import MinimumTvlSlider from './components/MinimumTvlSlider';
import { VaultCardList } from './components/VaultCardList';
import type { SortField } from './components/VaultCardList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VaultDetailPage from './pages/VaultDetailPage';

export default function App() {
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortFieldRaw] = useState<SortField | null>(null);
  const [minimumTvl, setMinimumTvl] = useState(0);
  const [showEol, setShowEol] = useState(false); 

  /* 点击链图标时切换选中状态 */
  const toggleChain = (key: string) =>
    setSelectedChains(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0F172A] text-white p-4 space-y-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vault/:id" element={<VaultDetailPage />} />
        </Routes>
        {/* 链筛选条 */}
        <ChainFilterBar selected={selectedChains} toggle={toggleChain} />

        {/* 其他筛选 UI（如分类、TVL 滑块） */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CategoryFilterBar 
            selected={selectedCategory}
            onSelected={setSelectedCategory}
          />
          <MinimumTvlSlider value={minimumTvl} onChange={setMinimumTvl} />
          {/* 新增 EOL 勾选框 */}
          <label className="flex items-center gap-2 bg-[#1e293b] px-4 py-2 rounded-xl text-white text-sm">
            <input
              type="checkbox"
              checked={showEol}
              onChange={e => setShowEol(e.target.checked)}
              className="accent-blue-500"
            />
            Show EOL
          </label>
        </div>

        {/* 卡片列表：把已选链传进去 */}
        <VaultCardList
          selectedChains={selectedChains}
          selectedCategory={selectedCategory}
          search={search}
          sortField={sortField}
          minimumTvl={minimumTvl}
          setSearch={setSearch}
          setSortField={val => setSortFieldRaw(val)}
          setMinimumTvl={setMinimumTvl}
          showEol={showEol}
        />
      </div>
    </BrowserRouter>
  );
}