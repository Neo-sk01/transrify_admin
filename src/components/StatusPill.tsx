type StatusValue = 'active' | 'duress' | 'ended' | 'normal' | 'fail' | 'open' | 'closed';

export default function StatusPill({ value }: { value: StatusValue }) {
  const getColor = (status: StatusValue) => {
    switch (status) {
      case 'duress':
        return 'bg-red-100 text-red-800';
      case 'active':
      case 'normal':
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'closed':
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${getColor(value)}`}>
      {value.toUpperCase()}
    </span>
  );
}