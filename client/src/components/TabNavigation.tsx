import React from 'react';
import { TabId } from '@/types';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{ id: TabId; label: string; icon: string }> = [
    { id: 'chat', label: 'Chat', icon: 'fa-comment-alt' },
    { id: 'image-analysis', label: 'Análisis de Imágenes', icon: 'fa-image' },
    { id: 'translation', label: 'Traducción', icon: 'fa-language' },
    { id: 'programming', label: 'Programación', icon: 'fa-code' }
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-4 px-1 font-medium text-sm border-b-2
              ${activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent'}
            `}
          >
            <i className={`fas ${tab.icon} mr-2`}></i>{tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
