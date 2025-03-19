import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-3">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-center md:justify-between items-center">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Kira AI. Todos los derechos reservados.</p>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-xs text-gray-400 hover:text-primary transition-colors">
              <i className="fas fa-question-circle mr-1"></i>Ayuda
            </a>
            <a href="#" className="text-xs text-gray-400 hover:text-primary transition-colors">
              <i className="fas fa-shield-alt mr-1"></i>Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
