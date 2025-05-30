import { useParams } from 'react-router-dom';

export default function VaultDetailPage() {
  // 获取路由参数中的 vault id
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4">
      {/* 基础布局结构 */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 标题区域 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Vault Details</h1>
          <div className="text-sm text-slate-400">ID: {id}</div>
        </div>

        {/* 主要内容区域 - 后续可以添加更多详细信息 */}
        <div className="bg-[#1E293B] rounded-lg p-6">
          <p className="text-slate-300">
            Vault details content will be added here...
          </p>
        </div>
      </div>
    </div>
  );
}