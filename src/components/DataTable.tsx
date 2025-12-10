import React, { useRef, useEffect } from 'react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  maxHeight?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  emptyMessage = 'No data available',
  maxHeight,
  onRowClick,
}: DataTableProps<T>): React.ReactElement {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  // Preserve scroll position on data updates
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Restore the previous scroll position
      container.scrollTop = scrollPositionRef.current;
    }
  }, [data]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Save the current scroll position
    scrollPositionRef.current = e.currentTarget.scrollTop;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-lg font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-auto rounded-lg border border-gray-200 shadow-sm"
      style={maxHeight ? { maxHeight } : undefined}
      onScroll={handleScroll}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10 shadow-sm">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300"
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`transition-all duration-200 ${
                onRowClick 
                  ? 'cursor-pointer hover:bg-blue-50 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-400 focus-within:bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              tabIndex={onRowClick ? 0 : undefined}
              role={onRowClick ? 'button' : undefined}
              onKeyDown={(e) => {
                if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRowClick(row);
                }
              }}
            >
              {columns.map((column, colIndex) => {
                const value =
                  typeof column.key === 'string' && column.key.includes('.')
                    ? column.key
                        .split('.')
                        .reduce<unknown>((obj, key) => (obj as Record<string, unknown>)?.[key], row as unknown)
                    : (row as Record<string, unknown>)[column.key as string];
                const renderedValue = column.render ? column.render(value, row) : (value as React.ReactNode);
                
                return (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {renderedValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
