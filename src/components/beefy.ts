// beefy.ts
export const CHAIN_ID_MAP: Record<string, string> = {
  ethereum: '1',
  polygon: '137',
  bsc: '56',
  optimism: '10',
  arbitrum: '42161',
  // ... add more chain mappings if needed
};

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

  return vaults
    .filter((v: any) => v.chain === 'ethereum')
    .map((v: any) => {
      const chainId = CHAIN_ID_MAP[v.chain];
      const apyInfo = apyMap[v.id];
      const tvl = tvlMap?.[chainId]?.[v.id];

      // // 调试日志
      // console.log(`\n=== Vault: ${v.id} ===`);
      // console.log('APY Info:', apyInfo);
      // console.log('TVL:', tvl);

      const totalApy = apyInfo?.totalApy;

      return {
        id: v.id,
        name: v.name,
        logo: v.logo,
        apy: typeof totalApy === 'number' ? (totalApy * 100).toFixed(2) : 'N/A',
        daily: typeof totalApy === 'number' ? Number((totalApy * 100 / 365).toFixed(4)) : 'N/A',
        tvl: typeof tvl === 'number' ? `$${Number(tvl).toLocaleString()}` : 'N/A',
        tags: [v.platformId, v.status].filter(Boolean).map(x => x.toUpperCase()),
      };
    });
}
