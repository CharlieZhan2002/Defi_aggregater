import { useState } from 'react';
import ChainFilterBar from '../components/ChainFilterBar';
import CategoryFilterBar from '../components/CategoryFilterBar';
import MinimumTvlSlider from '../components/MinimumTvlSlider';
import { VaultCardList } from '../components/VaultCardList';

export default function HomePage() {
  const [selectedChains, setSelectedChains] = useState<string[]>([]);

  const toggleChain = (key: string) =>
    setSelectedChains(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 space-y-4">
      <ChainFilterBar selected={selectedChains} toggle={toggleChain} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CategoryFilterBar />
        <MinimumTvlSlider />
      </div>
      <VaultCardList selectedChains={selectedChains} />
    </div>
  );
}