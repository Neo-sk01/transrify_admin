'use client';

import React from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface TabContainerProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export function TabContainer({ tabs, activeTab, onTabChange, children }: TabContainerProps) {
  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div 
        className="border-b-2 border-gray-200 bg-white shadow-sm rounded-t-lg"
        role="tablist"
        aria-label="Dashboard tabs"
      >
        <nav className="flex space-x-6 px-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`
                whitespace-nowrap py-4 px-2 border-b-3 font-medium text-sm
                transition-all duration-300 ease-in-out flex items-center gap-2
                min-h-[44px] min-w-[44px] relative
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-t
                ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              style={{
                borderBottomWidth: activeTab === tab.id ? '3px' : '2px',
                transform: activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              {tab.icon && <span className="flex-shrink-0 transition-transform duration-200">{tab.icon}</span>}
              <span className="transition-all duration-200">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`
                    ml-2 py-0.5 px-2.5 rounded-full text-xs font-semibold
                    transition-all duration-200 shadow-sm
                    ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white scale-105'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                  aria-label={`${tab.badge} items`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="mt-6 animate-fadeIn"
        style={{
          animation: 'fadeIn 300ms ease-in-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
