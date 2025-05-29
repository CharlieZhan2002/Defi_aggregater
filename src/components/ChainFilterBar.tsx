import React from 'react';

/* 链列表：如需增删，仅改这里 */
const CHAINS = [
  { key: 'ethereum',  name: 'Ethereum'  },
  { key: 'bsc',       name: 'BNB Chain' },
  { key: 'polygon',   name: 'Polygon'   },
  { key: 'arbitrum',  name: 'Arbitrum'  },
  { key: 'optimism',  name: 'Optimism'  },
  { key: 'fantom',    name: 'Fantom'    },
  { key: 'base',      name: 'Base'      },
  { key: 'celo',      name: 'Celo'      },
  { key: 'moonriver', name: 'Moonriver' },
  { key: 'moonbeam',  name: 'Moonbeam'  },
  { key: 'metis',     name: 'Metis'     },
  { key: 'kava',      name: 'Kava'      },
  { key: 'linea',     name: 'Linea'     },
  { key: 'zksync',    name: 'zkSync'    },
];

/* 生成图标路径 */
const iconUrl = (key: string) => `/images/networks/${key}.svg`;

type Props = {
  selected: string[];
  toggle: (key: string) => void;
};

export default function ChainFilterBar({ selected, toggle }: Props) {
  return (
    <div
      className="
        flex flex-wrap gap-2 px-3 py-2 rounded-xl
        bg-[#121826] scrollbar-hide overflow-x-auto"
    >
      {CHAINS.map(c => {
        const active = selected.includes(c.key);
        return (
          <button
            key={c.key}
            onClick={() => toggle(c.key)}
            title={c.name}
            className={`
              flex-shrink-0 rounded-full transition
              ring-1 ${active ? 'ring-blue-400' : 'ring-transparent hover:ring-blue-400'}
            `}
            /* 如果愿意可改成 outline-none  */
          >
            {/* clamp()：在 24–40px 区间根据空间自动伸缩 */}
            <img
              src={iconUrl(c.key)}
              alt={c.name}
              style={{ width: 'clamp(24px, 6vw, 40px)', height: 'clamp(24px, 6vw, 40px)' }}
            />
          </button>
        );
      })}
    </div>
  );
}
