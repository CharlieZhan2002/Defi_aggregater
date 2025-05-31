import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
// 20250530 yfh
import CategoryFilterBar from './CategoryFilterBar'

import type { SortField } from './VaultCardList' // 加上类型导入
// const sortFields = ['CURRENT APY', 'DAILY', 'TVL']
const sortFields: SortField[] = ['CURRENT APY', 'DAILY', 'TVL'];



export default function VaultToolbar({
  onSearch,
  onSort,
  onCategoryChange, //
}: {
  onSearch: (value: string) => void
  onSort: (field: SortField) => void
  onCategoryChange: (category: string | null) => void //
}) {
  const [search, setSearch] = useState('')
  //
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    // 
    // <div className="flex flex-col md:flex-row items-start md:items-center md:gap-12 gap-4 bg-[#1e293b] px-4 py-3 rounded-lg text-slate-300 text-sm">

    <div className="flex flex-col md:flex-row items-start md:items-center md:gap-12 gap-4 bg-[#1e293b] px-4 py-3 rounded-lg text-slate-300 text-sm">

      {/* 搜索框 */}
      <div className="flex items-center bg-[#0f172a] px-3 py-1.5 rounded-md w-full md:w-80">
        <FaSearch className="text-slate-500 mr-2" />
        <input
          type="text"
          placeholder="Search by asset name"
          value={search}
          onChange={e => {
            const val = e.target.value
            setSearch(val)
            onSearch(val)
          }}
          className="bg-transparent outline-none w-full text-white placeholder-slate-500"
        />
      </div>

      {/* 分类筛选栏 */}
      <CategoryFilterBar
        selected={selectedCategory}
        onSelected={(cat) => {
          setSelectedCategory(cat)
          onCategoryChange(cat)
        }}
      />

      {/* 排序字段 */}
      <div className="flex gap-26 flex-wrap justify-end w-full md:w-auto">
        {sortFields.map(field => (
          <button
            key={field}
            onClick={() => onSort(field)}
            className="hover:text-white cursor-pointer whitespace-nowrap"
          >
            {field}
          </button>
        ))}


      </div>

      

    </div>
  )
}
