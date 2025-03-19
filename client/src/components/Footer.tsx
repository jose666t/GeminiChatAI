import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Gemini AI Hub. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-3 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-question-circle mr-1"></i>Ayuda
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-shield-alt mr-1"></i>Privacidad
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-file-alt mr-1"></i>Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
