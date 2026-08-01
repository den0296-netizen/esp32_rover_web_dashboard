import React, { createContext, useContext, useState } from 'react';

// Context to share active state between Tabs and Tab components
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be rendered within a Tabs parent');
  }
  return context;
};

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface TabProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  tabInactiveClasses?: string;
  className?: string;
}

export const Tabs = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className = '',
}: TabsProps) => {
  const [internalTab, setInternalTab] = useState(defaultValue);

  // Support controlled or uncontrolled mode
  const activeTab = value !== undefined ? value : internalTab;

  const setActiveTab = (newValue: string) => {
    if (value === undefined) {
      setInternalTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div
        className={`flex shrink-0 flex-wrap gap-2 border-b px-4 py-3 ${className}`}
        role="tablist"
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const Tab = ({ value, children, disabled = false, tabInactiveClasses = '', className = '' }: TabProps) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={`
        rounded-full px-3 py-2 text-sm font-medium transition
        ${
          isActive
            ? 'bg-sky-500 text-slate-950'
            : tabInactiveClasses
        }
        ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-600' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Attach Tab as a compound component property
Tabs.Tab = Tab;

export default Tabs;