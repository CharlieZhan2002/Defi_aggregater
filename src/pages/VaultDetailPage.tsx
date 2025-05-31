import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { VaultDetails } from '../api/beefyAPI';
import { fetchVaultDetails } from '../api/beefyAPI';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function VaultDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [vault, setVault] = useState<VaultDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lpBreakdown, setLpBreakdown] = useState<LPBreakdown | null>(null);

    useEffect(() => {

        async function loadVaultDetails() {
            if (!id) return;

            try {
                setLoading(true);
                const details = await fetchVaultDetails(id);
                setVault(details);
                setError(null);
            } catch (err) {
                console.error('Error loading vault details:', err);
                setError(err instanceof Error ? err.message : 'Failed to load vault details');
            } finally {
                setLoading(false);
            }
        }

        loadVaultDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="text-white">Loading vault details...</div>
            </div>
        );
    }

    if (error || !vault) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="text-red-500">{error || 'Vault not found'}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* 基础信息卡片 */}
                <div className="bg-[#1E293B] rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{vault.name}</h1>
                            <div className="flex items-center gap-2 text-slate-400 mt-2">
                                <span>Chain: {vault.chain}</span>
                                <span className="text-slate-500">•</span>
                                <span>Assets: {vault.assets.join(' + ')}</span>
                            </div>
                        </div>
                    </div>

                    {/* 核心指标 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#0F172A] p-4 rounded-lg">
                            <div className="text-slate-400 text-sm mb-1">TVL</div>
                            <div className="text-2xl font-bold">
                                ${typeof vault.tvl === 'number' && vault.tvl > 0
                                    ? vault.tvl.toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 2
                                    })
                                    : '0.00'}
                            </div>
                        </div>

                        <div className="bg-[#0F172A] p-4 rounded-lg">
                            <div className="text-slate-400 text-sm mb-1">APY</div>
                            <div className="text-2xl font-bold text-green-400">
                                {((vault.apy || 0) * 100).toFixed(2)}%
                            </div>
                        </div>

                        <div className="bg-[#0F172A] p-4 rounded-lg">
                            <div className="text-slate-400 text-sm mb-1">Daily</div>
                            <div className="text-2xl font-bold text-blue-400">
                                {((vault.daily || 0) * 100).toFixed(4)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* 风险评分卡片 */}
                <div className="bg-[#1E293B] rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Safety Score</h2>
                    <div className="space-y-4">
                        {vault.risks.map(risk => {
                            const isPositive = [
                                'COMPLEXITY_LOW',
                                'BATTLE_TESTED',
                                'AUDIT',
                                'CONTRACTS_VERIFIED',
                                'PLATFORM_ESTABLISHED'
                            ].includes(risk);

                            return (
                                <div key={risk} className="flex items-center gap-3">
                                    {isPositive ? (
                                        <FaCheckCircle className="text-green-400 text-xl" />
                                    ) : (
                                        <FaExclamationTriangle className="text-yellow-400 text-xl" />
                                    )}
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {risk.split('_').map(word =>
                                                word.charAt(0) + word.slice(1).toLowerCase()
                                            ).join(' ')}
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            {isPositive ? 'Positive' : 'Risk'} factor
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                
            </div>
        </div>
    );
}