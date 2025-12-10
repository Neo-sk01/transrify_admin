type StatusValue = 'active' | 'duress' | 'ended' | 'normal' | 'fail' | 'open' | 'closed' | 'pending' | 'verified' | 'failed' | 'error' | 'NORMAL' | 'DURESS' | 'FAIL' | 'OPEN' | 'CLOSED' | 'PENDING' | 'VERIFIED' | 'FAILED' | 'ERROR';

export interface StatusPillProps {
  value: StatusValue;
  showLabel?: boolean;
}

export default function StatusPill({ value, showLabel = true }: StatusPillProps) {
  const normalizedValue = value.toLowerCase() as Lowercase<StatusValue>;
  
  const getColor = (status: string) => {
    switch (status) {
      case 'duress':
      case 'fail':
      case 'failed':
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'active':
      case 'normal':
      case 'open':
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed':
      case 'ended':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getAriaLabel = (status: string) => {
    switch (status) {
      case 'duress':
        return 'Duress status - critical alert';
      case 'active':
        return 'Active status';
      case 'normal':
        return 'Normal status - no issues';
      case 'open':
        return 'Open status - requires attention';
      case 'fail':
      case 'failed':
        return 'Failed status - error occurred';
      case 'closed':
        return 'Closed status - resolved';
      case 'ended':
        return 'Ended status - completed';
      case 'pending':
        return 'Pending verification';
      case 'verified':
        return 'Verified - integrity confirmed';
      case 'error':
        return 'Verification error';
      default:
        return `Status: ${status}`;
    }
  };

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border-2 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md ${getColor(normalizedValue)}`}
      aria-label={getAriaLabel(normalizedValue)}
      role="status"
    >
      {showLabel && value.toUpperCase()}
    </span>
  );
}