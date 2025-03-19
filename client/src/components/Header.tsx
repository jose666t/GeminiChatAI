import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-white text-xl"></i>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">Gemini AI Hub</span>
            </div>
          </div>
          <div className="flex items-center">
            <button className="bg-gray-100 p-2 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none">
              <i className="fas fa-moon"></i>
            </button>
            <button className="ml-4 bg-gray-100 p-2 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
