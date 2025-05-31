import React, { useEffect, useState } from 'react';
import { fetchBeefyVaultData } from './beefy';        // 注意相对路径
import { FaSearch, FaSortUp, FaSortDown } from 'react-icons/fa';
import { buildIconFallbackList } from '../utils/tokenIconPaths'
import { iconLayout } from '../utils/iconLayout';






/* ------------------------ 类型 & 常量 ------------------------ */
type Vault = {
  id: string;
  name: string;
  chain: string;
  assets: string[]; 
  apy: string;
  daily: string;
  tvl: string;
  tags: string[];
  category: string; // yfh add
};

export const sortFields = ['CURRENT APY', 'DAILY', 'TVL'] as const;
export type SortField = typeof sortFields[number];

/* 实用：把 $ % , 去掉转为数值 */
const toNumber = (v: unknown) => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/[$,%]/g, ''));
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

const formatApy = (val: string | number) => {
  const num = toNumber(val);
  if (isNaN(num)) return 'N/A';
  if (Math.abs(num) > 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  }
  return num.toFixed(2);
};

const formatDaily = (val: string | number) => {
  const num = toNumber(val);
  if (isNaN(num)) return 'N/A';
  if (Math.abs(num) > 1e6) {
    return (num / 1e6).toFixed(4) + 'M';
  }
  return num.toFixed(4);
};

const formatTvl = (val: string | number) => {
  const num = toNumber(val);
  if (isNaN(num)) return 'N/A';
  if (Math.abs(num) > 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  }
  return Math.round(num).toString();
};

/* 根据链名拼本地 icon 路径 */
const getChainIconUrl = (chain: string) =>
  `/images/networks/${chain}.svg`;

/* ------------------------ 组件主体 ------------------------ */
type Props = {
  selectedChains: string[];   // 传入已选链 key 数组
  selectedCategory: string | null; // new
  
  search: string;
  sortField: SortField | null; 
  minimumTvl: number; 
  
  setSearch: (val: string) => void;
  setSortField: (val: SortField | null) => void; 
  setMinimumTvl: (val: number) => void;
  showEol: boolean; 
};
// type Props = {
//   selectedChains: string[];
//   // selectedCategory: string | null;
//   selectedCategory?: string | null;
//   search: string;
//   sortField: SortField | '';
//   minimumTvl: number; //  yfh add
// };


// 20250531 yfh
// export const VaultCardList: React.FC<Props> = ({ selectedChains, selectedCategory }) => {
  // const [vaults, setVaults] = useState<Vault[]>([]);
  // const [search, setSearch] = useState('');
  // const [sortField, setSortField] = useState<SortField | ''>('');
  // const [sortAsc, setSortAsc] = useState(false);
  // const [minimumTvl, setMinimumTvl] = useState(0); // add
  export const VaultCardList: React.FC<Props> = ({
  selectedChains,
  selectedCategory,
  search,
  sortField,
  minimumTvl,
  setSearch,
  setSortField,
  setMinimumTvl,
  showEol 
}) => {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => { fetchBeefyVaultData().then(setVaults); }, []);

  // 修改排序按钮点击逻辑：第三次点击取消排序
  const handleSortClick = (field: SortField) => {
    if (sortField === field) {
      if (!sortAsc) {
        setSortAsc(true); // 第二次点击，升序
      } else {
        setSortField(null); // 第三次点击，取消排序
        setSortAsc(false);
      }
    } else {
      setSortField(field); // 新字段，降序
      setSortAsc(false);
    }
  };

  /* 过滤 & 排序 */
  const shown = vaults
    .filter(v => {
      console.log('[DEBUG] 当前分类:', selectedCategory)
      console.log('[DEBUG] 当前 vault tags:', v.tags)



      if (!showEol && v.tags.includes('EOL')) return false;
      return (
        v.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedChains.length === 0 || selectedChains.includes(v.chain)) &&
        (!selectedCategory || v.category === selectedCategory)
      );
    })
    .filter(v =>
      v.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedChains.length === 0 || selectedChains.includes(v.chain)) &&
      (!selectedCategory || v.category === selectedCategory) &&
      toNumber(v.tvl) >= minimumTvl &&
      (showEol || !v.tags.includes('EOL')) // 再次确保
    )
    .sort((a, b) => {
      if (!sortField) return 0; // 未排序时不变
      let aV = 0, bV = 0;
      switch (sortField) {
        case 'CURRENT APY': aV = toNumber(a.apy);   bV = toNumber(b.apy);   break;
        case 'DAILY':       aV = toNumber(a.daily); bV = toNumber(b.daily); break;
        case 'TVL':         aV = toNumber(a.tvl);   bV = toNumber(b.tvl);   break;
        default: return 0;
      }
      return sortAsc ? aV - bV : bV - aV;
    });

  return (
    // <div className="space-y-4">
    <div className="space-y-4 relative z-10">
      {/* 搜索 + 排序 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1e293b] px-4 py-3 rounded-lg text-slate-300 text-sm">
        {/* 搜索框 */}
        <div className="flex items-center bg-[#0f172a] px-3 py-1.5 rounded-md w-full md:w-80">
          <FaSearch className="text-slate-500 mr-2" />
          <input
            placeholder="Search by asset name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-white placeholder-slate-500"
          />
        </div>
        {/* 排序字段 */}
        <div className="flex gap-12 flex-wrap justify-end w-full md:w-auto">
          {sortFields.map(f => (
            <button
              key={f}
              onClick={() => handleSortClick(f)}
              className={`flex items-center gap-2 px-3 py-1 rounded-md border border-slate-600 
                          hover:text-white hover:border-white transition-all
                          ${sortField === f ? 'text-white font-semibold bg-slate-700' : 'text-slate-400'}`}
            >
              <span>{f}</span>
              <div className="flex flex-col text-xs leading-none">
                <FaSortUp
                  className={sortField === f && sortAsc ? 'text-white' : 'text-slate-500'}
                />
                <FaSortDown
                  className={sortField === f && !sortAsc && sortField === f ? 'text-white' : 'text-slate-500'}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 表头（大屏） */}
      {/* <div className="hidden md:flex justify-between text-xs text-slate-400 px-2 pl-16 pr-6">
        <div className="w-1/2" />
        <div className="flex gap-10 w-1/2 justify-end">
          <div className="w-28 text-right">APY</div>
          <div className="w-28 text-right">Daily</div>
          <div className="w-28 text-right">TVL</div>
        </div>
      </div> */}

      {/* 卡片列表 */}
      <div className="relative z-0 space-y-4"></div>
      {shown.map(v => (
        <div key={v.id}
          className="relative flex items-center justify-between bg-[#1e293b] text-white
                     rounded-lg px-4 py-3 shadow hover:shadow-lg transition">
          {/* 链图标 */}
          <img
            src={getChainIconUrl(v.chain)}
            onError={e => {
              const img = e.currentTarget as HTMLImageElement;
              if (!img.dataset.fallback) {
                img.dataset.fallback = 'true';
                img.src = '/images/networks/default.svg';
              }
            }}
            alt={v.chain}
            className="absolute top-2 left-2 w-4 h-4"
          />

         {/* 左侧信息 */}
<div className="flex items-center gap-4 w-1/2 pl-4">
  {/* 资产图标组 */}
<div className="relative" style={{ width: 40, height: 40 }}>
  {v.assets.slice(0, 4).map((sym: string, idx: number) => {
    const paths = buildIconFallbackList(v.chain, sym);
    const { translate, z, size } = iconLayout(v.assets.length, idx);

    return (
      <img
        key={sym}
        src={paths[0]}
        data-fallback={JSON.stringify(paths.slice(1))}
        onError={e => {
          const img = e.currentTarget as HTMLImageElement;
          const list = JSON.parse(img.dataset.fallback || '[]') as string[];
          if (list.length) {
            img.src = list.shift()!;
            img.dataset.fallback = JSON.stringify(list);
          }
        }}
        alt={sym}
        style={{
          position: 'absolute',
          width: size,
          height: size,
          translate,
          zIndex: z,
        }}
        className="rounded-full object-contain bg-[#1e2537] ring-1 ring-[#1e2537]"
      />
    );
  })}
</div>


  {/* 名称 & 标签 */}
  <div>
    <div className="text-base font-semibold">{v.name}</div>
    <div className="flex gap-2 mt-1 text-xs">
      {v.tags.map(t => (
        <span key={t} className="bg-slate-700 px-2 py-0.5 rounded-full capitalize">
          {t}
        </span>
      ))}
    </div>
  </div>
</div>


          {/* 右侧数值 */}
          <div className="flex gap-10 w-1/2 justify-end text-sm text-right">
            {/* <div className="w-20 text-yellow-400 font-semibold">{v.apy}</div>
            <div className="w-28 text-yellow-400 font-semibold" title={v.apy}>
              {formatNumber(v.apy)}%
            </div>
            <div className="w-28">{v.tvl}</div> */}

          <div className="w-28 text-yellow-400 font-semibold" title={v.apy}>
              {formatApy(v.apy)}%
            </div>
            <div className="w-28 text-green-400" title={v.daily}>
              {formatDaily(v.daily)}%
            </div>
            <div className="w-28" title={v.tvl}>
              ${formatTvl(v.tvl)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
