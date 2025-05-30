// src/beefy.ts
export const CHAIN_ID_MAP: Record<string, string> = {
  ethereum:  '1',
  polygon:   '137',
  bsc:       '56',
  arbitrum:  '42161',
  optimism:  '10',
  avalanche: '43114',
  fantom:    '250',
  base:      '8453',
  celo:      '42220',
  moonriver: '1285',
  moonbeam:  '1284',
  metis:     '1088',
  kava:      '2222',
  linea:     '59144',
  zksync:    '324',
  // 继续补充链映射即可
};

export type VaultUI = {
  id:    string;
  name:  string;
  chain: string; 
  assets: string[];  
  apy:   string;    
  daily: string;     
  tvl:   string;     
  tags:  string[];
  category: string;  // 20250530 yfh 新增
};

export async function fetchBeefyVaultData(): Promise<VaultUI[]> {
  const [vaultsRes, apyRes, tvlRes] = await Promise.all([
    fetch('https://api.beefy.finance/vaults'),
    fetch('https://api.beefy.finance/apy/breakdown'),
    fetch('https://api.beefy.finance/tvl'),
  ]);

  const [vaults, apyMap, tvlMap] = await Promise.all([
    vaultsRes.json(),
    apyRes.json(),
    tvlRes.json(),
  ]);

  return vaults.map((v: any) => {
    // --- APY ---
    const apyInfo  = apyMap?.[v.id];
    const totalApy = typeof apyInfo?.totalApy === 'number' ? apyInfo.totalApy : undefined;

    // --- TVL ---
    const chainId  = CHAIN_ID_MAP[v.chain];
    const tvlRaw   = chainId ? tvlMap?.[chainId]?.[v.id] : undefined;

    // 20250530 yfh add 
    // 分类逻辑（可以按名称、平台、symbol 自定义）
    // let category = 'Others';
    // const name = v.name?.toLowerCase() || '';
    // if (name.includes('USDC') || name.includes('DAI') || name.includes('USDT')) {
    //   category = 'Stablecoins';
    // } else if (name.includes('ETH') || name.includes('BTC')) {
    //   category = 'Blue Chips';
    // } else if (name.includes('DOGES') || name.includes('SHIBA') || name.includes('PEPE')) {
    //   category = 'Memes';
    // } else if (v.platformId?.toLowerCase().includes('CURVE')) {
    //   category = 'Correlated';
    // }
    function guessCategory(name: string): string {
      const lower = name.toLowerCase();

      if (lower.includes('usdt') || lower.includes('usdc') || lower.includes('usd')) {
        return 'Stablecoins';
      }
      if (lower.includes('btc') || lower.includes('eth') || lower.includes('matic')) {
        return 'Blue Chips';
      }
      if (lower.includes('doge') || lower.includes('pepe') || lower.includes('shib')) {
        return 'Memes';
      }

      return 'Correlated';
    }


    return {
      id:    v.id,
      name:  v.name,
      chain: v.chain,
      assets: v.assets ?? [], 

      apy:   totalApy !== undefined ? (totalApy * 100).toFixed(2) + '%' : 'N/A',
      daily: totalApy !== undefined ? ((totalApy * 100 / 365).toFixed(4) + '%') : 'N/A',

      tvl:   typeof tvlRaw === 'number'
               ? `$${Math.round(tvlRaw).toLocaleString()}`
               : 'N/A',

      tags:  [v.platformId, v.status].filter(Boolean).map(t => t.toUpperCase()),
      // category, // 20250530 yfh add
      category: guessCategory(v.name), // 自己写分类函数

    };
  });
}
