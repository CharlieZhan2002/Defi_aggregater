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

export interface LPTokenInfo {
    price: number;
    tokens: string[];
    balances: string[];
    totalSupply: string;
}

export interface LPBreakdown {
    tokens: {
        symbol: string;
        amount: number;
        value: number;
    }[];
    totalValue: number;
    lpAmount: number;
}

export async function fetchLPBreakdown(vaultId: string): Promise<LPBreakdown | null> {
    try {
        const [lpsResponse, tokensResponse] = await Promise.all([
            fetch(`${BEEFY_API_BASE}/lps/${vaultId}`),
            fetch(`${BEEFY_API_BASE}/tokens`)
        ]);

        if (!lpsResponse.ok) {
            console.warn(`No LP data for vault ${vaultId}`);
            return null;
        }

        const lpData: LPTokenInfo = await lpsResponse.json();
        const tokens = await tokensResponse.json();

        const totalValue = parseFloat(lpData.price);
        const breakdown: LPBreakdown = {
            tokens: lpData.tokens.map((token, index) => ({
                symbol: token,
                amount: parseFloat(lpData.balances[index]),
                value: (parseFloat(lpData.balances[index]) * totalValue) / 2
            })),
            totalValue,
            lpAmount: parseFloat(lpData.totalSupply)
        };

        return breakdown;
    } catch (error) {
        console.error('Failed to fetch LP breakdown:', error);
        return null;
    }
}

export async function fetchVaultDetails(vaultId: string): Promise<VaultDetails> {
    const [vaultResponse, apyResponse, tvlResponse] = await Promise.all([
        fetch(`${BEEFY_API_BASE}/vaults`),
        fetch(`${BEEFY_API_BASE}/apy`),
        fetch(`${BEEFY_API_BASE}/tvl`)
    ]);

    const vaults = await vaultResponse.json();
    const apys = await apyResponse.json();
    const tvls = await tvlResponse.json();

    const vault = vaults.find((v: any) => v.id === vaultId);
    if (!vault) throw new Error('Vault not found');

    const tvl = tvls[vaultId];
    if (typeof tvl !== 'number') {
        console.warn(`TVL data not found for vault ${vaultId}`);
    }

    return {
        ...vault,
        // tvl: tvls[vaultId] || 0,
        tvl: tvl || 0,
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