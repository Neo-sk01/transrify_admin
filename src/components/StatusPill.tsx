export default function StatusPill({ value }: { value: 'active'|'duress'|'ended' }) {
const color = value === 'duress' ? 'bg-red-100 text-red-800' : value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
return <span className={`px-2 py-1 text-xs rounded-full ${color}`}>{value}</span>;
}