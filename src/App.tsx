import './App.css';
import { useState } from 'react';

import ChainFilterBar from './components/ChainFilterBar';
import CategoryFilterBar from './components/CategoryFilterBar';
import MinimumTvlSlider from './components/MinimumTvlSlider';
import { VaultCardList } from './components/VaultCardList';

export default function App() {
  const [selectedChains, setSelectedChains] = useState<string[]>([]);

  /* 点击链图标时切换选中状态 */
  const toggleChain = (key: string) =>
    setSelectedChains(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 space-y-4">
      {/* 链筛选条 */}
      <ChainFilterBar selected={selectedChains} toggle={toggleChain} />

      {/* 其他筛选 UI（如分类、TVL 滑块） */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CategoryFilterBar />
        <MinimumTvlSlider />
      </div>

      {/* 卡片列表：把已选链传进去 */}
      <VaultCardList selectedChains={selectedChains} />
    </div>
  );
}
