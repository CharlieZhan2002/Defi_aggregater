export const iconLayout = (
  total: number,
  idx: number,
): { translate: string; z: number; size: number } => {
  // 基准尺寸 40px，缩小时乘 0.8
  const base = 40;

  // 单资产
  if (total === 1) {
    return { translate: '0 0', z: 1, size: base };
  }

  // 双资产：右边突出一点
  if (total === 2) {
    if (idx === 0) return { translate: '0 0',   z: 2, size: base };
    else           return { translate: '10px 0', z: 1, size: base };
  }

  /* 三个及以上：2×2 网格，最多 4 个 */
  const grid = [
    { x: 0,  y: 0 },
    { x: 14, y: 0 },
    { x: 0,  y: 14 },
    { x: 14, y: 14 },
  ][idx] ?? { x: 0, y: 0 };

  return {
    translate: `${grid.x}px ${grid.y}px`,
    z: 2 - Math.floor(idx / 2), // 上排 2,1  下排 1,0
    size: base * 0.8,
  };
};
