import { useParams } from 'react-router-dom';

export default function VaultDetail() {
  const { id } = useParams();
  return (
    <div className="text-white text-xl p-6">
      Vault ID: <span className="text-yellow-300">{id}</span>
    </div>
  );
}
