// VaultCardList.tsx
import React, { useEffect, useState } from 'react';
import { fetchBeefyVaultData } from './beefy';
import { FaSearch, FaSortUp, FaSortDown } from 'react-icons/fa';

const sortFields = ['CURRENT APY', 'DAILY', 'TVL'] as const;
type SortField = typeof sortFields[number];

type Vault = {
  id: string;
  name: string;
  logo: string;
  apy: string;      // 已是“12.34%”
  daily: string;    // 已是“0.0340%”
  tvl: string;      // 已是“$123,456”
  tags: string[];
};

export const VaultCardList = () => {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField | ''>('');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetchBeefyVaultData().then(setVaults);
  }, []);

  const handleSortClick = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filtered = vaults
    .filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const num = (value: unknown) => {
  if (typeof value === 'number') return value;               // 本身就是数字
  if (typeof value === 'string') {
    const cleaned = value.replace(/[$,%]/g, '');             // 去掉 $ 和 %
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;                                                  // undefined / 其他
};         // 把 $, % 都去掉
      let aVal = 0, bVal = 0;
      switch (sortField) {
        case 'CURRENT APY': aVal = num(a.apy);   bVal = num(b.apy);   break;
        case 'DAILY':       aVal = num(a.daily); bVal = num(b.daily); break;
        case 'TVL':         aVal = num(a.tvl);   bVal = num(b.tvl);   break;
        default: return 0;
      }
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

  return (
    <div className="p-4 space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1e293b] px-4 py-3 rounded-lg text-slate-300 text-sm">
        {/* 搜索框 */}
        <div className="flex items-center bg-[#0f172a] px-3 py-1.5 rounded-md w-full md:w-80">
          <FaSearch className="text-slate-500 mr-2" />
          <input
            type="text"
            placeholder="Search by asset name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-white placeholder-slate-500"
          />
        </div>

        {/* 排序字段 */}
        <div className="flex gap-6 flex-wrap justify-end w-full md:w-auto">
          {sortFields.map(field => (
            <button
              key={field}
              onClick={() => handleSortClick(field)}
              className={`flex items-center gap-1 cursor-pointer whitespace-nowrap hover:text-white ${
                sortField === field ? 'text-white font-semibold' : ''
              }`}
            >
              {field}
              {sortField === field &&
                (sortAsc ? <FaSortUp className="text-xs" /> : <FaSortDown className="text-xs" />)}
            </button>
          ))}
        </div>
      </div>

      {/* 表头 */}
      <div className="hidden md:flex justify-between text-xs text-slate-400 px-2 pl-16 pr-6">
        <div className="w-1/2" />
        <div className="flex gap-10 w-1/2 justify-end">
          <div className="w-20 text-right">APY</div>
          <div className="w-20 text-right">Daily</div>
          <div className="w-24 text-right">TVL</div>
        </div>
      </div>

      {/* 卡片列表 */}
      {filtered.map(vault => (
        <div
          key={vault.id}
          className="flex items-center justify-between bg-[#1e293b] text-white rounded-lg px-4 py-3 shadow hover:shadow-lg transition"
        >
          {/* 左侧 */}
          <div className="flex items-center gap-4 w-1/2">
            <img src={`https://app.beefy.finance/icons/${vault.logo}`} alt={vault.name} className="w-10 h-10 rounded-full" />
            <div>
              <div className="text-base font-semibold">{vault.name}</div>
              <div className="flex gap-2 mt-1 text-xs">
                {vault.tags.map(tag => (
                  <span key={tag} className="bg-slate-700 px-2 py-0.5 rounded-full capitalize">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧数值 */}
          <div className="flex gap-10 w-1/2 justify-end text-sm text-right">
            <div className="w-20 text-yellow-400 font-semibold">{vault.apy}</div>
            <div className="w-20 text-green-400">{vault.daily}</div>
            <div className="w-24">{vault.tvl}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
