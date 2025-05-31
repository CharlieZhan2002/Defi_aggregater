export const BEEFY_API_BASE = 'https://api.beefy.finance';

export interface VaultDetails {
    id: string;
    name: string;
    token: string;
    tokenAddress: string;
    tokenDecimals: number;
    tokenProviderId: string;
    earnedToken: string;
    earnedTokenAddress: string;
    earnContractAddress: string;
    oracle: string;
    oracleId: string;
    status: string;
    platformId: string;
    assets: string[];
    strategyTypeId: string;
    risks: string[];
    addLiquidityUrl: string;
    network: string;
    chain: string;
    strategy: string;
    lastHarvest: number;
    pricePerFullShare: string;
    createdAt: number;
    tvl?: number;
    apy?: number;
    daily?: number;
}

export interface HistoricalRate {
    date: string;
    apy: number;
}

export interface APYBreakdown {
    vaultApr?: number;
    compoundingsPerYear?: number;
    beefyPerformanceFee?: number;
    vaultApy?: number;
    lpFee?: number;
    tradingApr?: number;
    totalApy: number;
}

export interface LPTokenData {
    price: number;
    tokens: string[];  // token addresses
    balances: string[];
    totalSupply: string;
}

export interface LPBreakdown {
    price: number;
    tokens: string[];
    balances: string[];
    totalSupply: string;
    underlyingBalances?: string[];
}


export async function fetchVaultDetails(vaultId: string): Promise<VaultDetails> {
    const [vaultResponse, apyResponse, tvlResponse] = await Promise.all([
        fetch(`${BEEFY_API_BASE}/vaults`),
        fetch(`${BEEFY_API_BASE}/apy`),
        fetch(`${BEEFY_API_BASE}/tvl`)
    ]);

    const vaults = await vaultResponse.json();
    const apys = await apyResponse.json();
    const tvlData = await tvlResponse.json();

    const vault = vaults.find((v: any) => v.id === vaultId);
    if (!vault) throw new Error('Vault not found');

    const chainIdMap: { [key: string]: string } = {
        'ethereum': '1',
        'bsc': '56',
        'polygon': '137',
        'optimism': '10',
        'arbitrum': '42161',
        'cronos': '25',
        'fantom': '250',
        'gnosis': '100',
        'avax': '43114',      // Avalanche C-Chain
        'aurora': '1313161554',
        'base': '8453',
        'canto': '7700',
        'celo': '42220',
        'emerald': '42262',   // Oasis Emerald
        'fuse': '122',
        'harmony': '1666600000',
        'heco': '128',        // Huobi ECO Chain
        'kava': '2222',
        'metis': '1088',
        'moonbeam': '1284',
        'moonriver': '1285',
        'polygon-zkevm': '1101',
        'zksync': '324'
    };

    const chainId = chainIdMap[vault.network] || chainIdMap[vault.chain];
    if (!chainId) {
        console.warn(`Unknown chain for vault ${vaultId}: ${vault.network}/${vault.chain}`);
        return {
            ...vault,
            tvl: 0,
            apy: apys[vaultId] || 0,
            daily: (apys[vaultId] || 0) / 365
        };
    }
    const chainTvlData = tvlData[chainId] || {};
    const tvl = Number(chainTvlData[vaultId]);

    if (isNaN(tvl)) {
        console.warn(`Invalid TVL data for vault ${vaultId} on chain ${chainId}: ${chainTvlData[vaultId]}`);
    }

    // if (typeof tvl !== 'number') {
    //     console.warn(`TVL data not found for vault ${vaultId}`);
    // }

    return {
        ...vault,

        tvl: isNaN(tvl) ? 0 : tvl,
        apy: apys[vaultId] || 0,
        daily: (apys[vaultId] || 0) / 365
    };
}

export async function fetchHistoricalRates(vaultId: string): Promise<HistoricalRate[]> {
    const response = await fetch(`${BEEFY_API_BASE}/apy/historical/${vaultId}`);

    if (!response.ok) {
        throw new Error(`Historical data request failed: ${response.statusText}`);
    }

    const historicalData = await response.json();

    if (!historicalData || typeof historicalData !== 'object') {
        return [];
    }

    return Object.entries(historicalData)
        .filter(([_, apy]) => apy !== null && !isNaN(Number(apy)))
        .map(([date, apy]) => ({
            date: new Date(parseInt(date) * 1000).toLocaleDateString(),
            apy: Number(apy) * 100
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function fetchLPBreakdown(vaultId: string): Promise<LPBreakdown | null> {
    try {
        const response = await fetch(`${BEEFY_API_BASE}/lps/breakdown`);
        const breakdownData = await response.json();

        if (!breakdownData[vaultId]) {
            console.warn(`No LP breakdown data for vault ${vaultId}`);
            return null;
        }

        return breakdownData[vaultId];
    } catch (error) {
        console.error('Failed to fetch LP breakdown:', error);
        return null;
    }
}