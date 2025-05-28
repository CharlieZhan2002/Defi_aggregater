// fetchBeefyVaultData.ts
export async function fetchBeefyVaultData() {
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

  // 映射链名 → chainId（/tvl 顶层 key）
  const CHAIN_ID_MAP: Record<string, string> = {
    ethereum: '1',
    bsc: '56',
    polygon: '137',
    arbitrum: '42161',
    optimism: '10',
    avalanche: '43114',
    fantom: '250',
    base: '8453',
    celo: '42220',
  };

  return vaults
    .filter((v: any) => v.chain === 'ethereum')          // ← 只要以太坊，可改成其它链
    .map((v: any) => {
      const chainId = CHAIN_ID_MAP[v.chain];
      const tvlRaw   = tvlMap?.[chainId]?.[v.id];
      const apyInfo  = apyMap?.[v.id];

      const totalApy = apyInfo?.totalApy;                // 年化（小数 0-1）

      return {
        id:    v.id,
        name:  v.name,
        logo:  v.logo,
        apy:   typeof totalApy === 'number' ? (totalApy * 100).toFixed(2) + '%' : 'N/A',
        daily: typeof totalApy === 'number' ? ((totalApy * 100) / 365).toFixed(4) + '%' : 'N/A',
        tvl:   typeof tvlRaw  === 'number'  ? `$${Math.round(tvlRaw).toLocaleString()}` : 'N/A',
        tags:  [v.platformId, v.status].filter(Boolean).map(t => t.toUpperCase()),
      };
    });
}
