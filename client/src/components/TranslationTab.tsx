import React, { useState, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Language, TranslationResult } from '@/types';

const TranslationTab: React.FC = () => {
  const languages: Language[] = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'Inglés' },
    { code: 'fr', name: 'Francés' },
    { code: 'de', name: 'Alemán' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Portugués' },
    { code: 'ru', name: 'Ruso' },
    { code: 'zh', name: 'Chino' },
    { code: 'ja', name: 'Japonés' }
  ];

  const [sourceLanguage, setSourceLanguage] = useState('es');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: 'Texto requerido',
        description: 'Por favor, ingresa el texto que deseas traducir.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsTranslating(true);
    
    try {
      const response = await apiRequest('POST', '/api/translate', {
        text: sourceText,
        sourceLanguage: languages.find(l => l.code === sourceLanguage)?.name || sourceLanguage,
        targetLanguage: languages.find(l => l.code === targetLanguage)?.name || targetLanguage
      });
      
      const data = await response.json();
      setTranslationResult(data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to translate text');
      }
    } catch (error) {
      console.error('Error during translation:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error durante la traducción',
        variant: 'destructive'
      });
    } finally {
      setIsTranslating(false);
    }
  };
  
  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translationResult?.translation || '');
    setTranslationResult(null);
  };
  
  const copyTranslation = () => {
    if (translationResult?.translation) {
      navigator.clipboard.writeText(translationResult.translation);
      toast({
        title: 'Copiado',
        description: 'Texto copiado al portapapeles'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Traducción</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Source Text */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="source-language" className="block text-sm font-medium text-gray-700">Idioma de origen:</label>
              <select 
                id="source-language" 
                className="text-sm border-0 bg-transparent focus:ring-0"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <textarea 
              id="source-text" 
              rows={8} 
              placeholder="Ingresa el texto que quieres traducir..." 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            ></textarea>
          </div>
          
          {/* Controls */}
          <div className="flex md:flex-col justify-center items-center py-2">
            <button 
              type="button" 
              className="rounded-full p-2 bg-gray-100 hover:bg-gray-200"
              onClick={swapLanguages}
              disabled={isTranslating}
            >
              <i className="fas fa-exchange-alt text-gray-600"></i>
            </button>
          </div>
          
          {/* Target Text */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="target-language" className="block text-sm font-medium text-gray-700">Idioma de destino:</label>
              <select 
                id="target-language" 
                className="text-sm border-0 bg-transparent focus:ring-0"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <textarea 
                id="target-text" 
                rows={8} 
                placeholder="Traducción..." 
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none" 
                value={translationResult?.translation || ''}
                readOnly
              ></textarea>
              {translationResult?.translation && (
                <div className="absolute bottom-2 right-2 flex space-x-1">
                  <button 
                    type="button" 
                    className="p-1.5 text-gray-500 hover:text-gray-700 bg-white rounded border border-gray-300" 
                    title="Copiar texto"
                    onClick={copyTranslation}
                  >
                    <i className="fas fa-copy text-sm"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Translate Button */}
        <div className="mt-6 text-center">
          <button 
            type="button" 
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
            onClick={handleTranslate}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <>
                <i className="fas fa-circle-notch fa-spin mr-2"></i>Traduciendo...
              </>
            ) : (
              <>
                <i className="fas fa-language mr-2"></i>Traducir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationTab;
