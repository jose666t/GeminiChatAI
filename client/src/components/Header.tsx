import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 md:h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
                <i className="fas fa-robot text-white text-sm md:text-xl"></i>
              </div>
              <div className="ml-2 md:ml-3 flex flex-col md:flex-row md:items-center">
                <span className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                  Kira
                </span>
                {!isMobile && (
                  <span className="md:ml-1 text-xs text-gray-500 font-normal">
                    Asistente IA
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none transition-colors">
              <i className="fas fa-question-circle text-sm"></i>
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none transition-colors">
              <i className="fas fa-cog text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
