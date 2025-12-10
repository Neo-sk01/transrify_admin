import React from 'react';

export interface OverviewCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function OverviewCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  variant = 'default',
}: OverviewCardProps): React.ReactElement {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
  };

  const trendStyles = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div
      className={`rounded-xl border-2 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${variantStyles[variant]}`}
      role="region"
      aria-label={`${title} metric card`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide" id={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
            {title}
          </p>
          <p 
            className="mt-3 text-4xl font-bold text-gray-900 transition-all duration-200"
            aria-labelledby={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {value}
          </p>
          {trend && trendValue && (
            <p 
              className={`mt-3 text-sm font-medium flex items-center gap-1 ${trendStyles[trend]}`}
              aria-label={`Trend: ${trend} ${trendValue}`}
            >
              {trend === 'up' && <span className="text-lg">↑</span>}
              {trend === 'down' && <span className="text-lg">↓</span>}
              <span>{trendValue}</span>
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0 text-gray-400 transition-transform duration-200 hover:scale-110" aria-hidden="true">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
