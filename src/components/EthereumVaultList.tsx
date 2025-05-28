import React, { useEffect, useState } from 'react';

interface Vault {
  id: string;
  name: string;
  platform: string;
  chain: string;
  token: string;
  apy?: {
    net_apy?: number;
  };
  logo: string;
}

export default function EthereumVaultList() {
  const [vaults, setVaults] = useState<Vault[]>([]);

  useEffect(() => {
    fetch('https://api.beefy.finance/vaults')
      .then((res) => res.json())
      .then((data: Vault[]) => {
        const ethVaults = data.filter((v) => v.chain === 'ethereum');
        setVaults(ethVaults);
      });
  }, []);

  return (
    <div className="p-6 bg-[#0f172a] text-white space-y-4">
      <h2 className="text-xl font-bold">Ethereum Vaults</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {vaults.map((vault) => (
          <div
            key={vault.id}
            className="bg-[#1e293b] rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={`https://app.beefy.finance/icons/${vault.logo}`}
                alt={vault.name}
                className="w-8 h-8"
              />
              <div>
                <div className="font-semibold">{vault.name}</div>
                <div className="text-sm text-gray-400">{vault.token}</div>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-300">
              APY:{' '}
              <span className="text-green-400">
                {vault.apy?.net_apy ? (vault.apy.net_apy * 100).toFixed(2) + '%' : 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
