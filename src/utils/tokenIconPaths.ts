export const buildIconFallbackList = (chain: string, symbol: string): string[] => {
  const lower = symbol.toLowerCase();

  return [
    // 先试 **原始大小写**
    `/images/single-assets/${chain}/${symbol}.svg`,
    `/images/single-assets/${chain}/${symbol}.png`,
    `/images/single-assets/${symbol}.svg`,
    `/images/single-assets/${symbol}.png`,

    // 再试全小写
    `/images/single-assets/${chain}/${lower}.svg`,
    `/images/single-assets/${chain}/${lower}.png`,
    `/images/single-assets/${lower}.svg`,
    `/images/single-assets/${lower}.png`,

    '/images/single-assets/default.svg',
  ];
};
