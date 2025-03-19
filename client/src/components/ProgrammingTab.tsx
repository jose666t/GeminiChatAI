import React, { useState, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CodeLanguage, CodeGenerationResult } from '@/types';

const ProgrammingTab: React.FC = () => {
  const codeLanguages: CodeLanguage[] = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [codeResult, setCodeResult] = useState<CodeGenerationResult | null>(null);
  const { toast } = useToast();

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt requerido',
        description: 'Por favor, describe lo que necesitas generar.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await apiRequest('POST', '/api/generate-code', {
        prompt,
        language: selectedLanguage
      });
      
      const data = await response.json();
      setCodeResult(data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate code');
      }
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error generando código',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyCode = () => {
    if (codeResult?.code) {
      navigator.clipboard.writeText(codeResult.code);
      toast({
        title: 'Copiado',
        description: 'Código copiado al portapapeles'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Asistente de Programación</h2>
        
        {/* Language Selection and Prompt */}
        <div className="mb-4">
          <label htmlFor="programming-language" className="block text-sm font-medium text-gray-700 mb-1">Lenguaje de programación:</label>
          <select 
            id="programming-language" 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {codeLanguages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="code-prompt" className="block text-sm font-medium text-gray-700 mb-1">Describe lo que necesitas:</label>
          <textarea 
            id="code-prompt" 
            rows={4} 
            placeholder="Ej: Crea una función que calcule el factorial de un número" 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
        </div>
        
        <div className="flex justify-center mb-6">
          <button 
            type="button" 
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
            onClick={handleGenerateCode}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <i className="fas fa-circle-notch fa-spin mr-2"></i>Generando...
              </>
            ) : (
              <>
                <i className="fas fa-code mr-2"></i>Generar código
              </>
            )}
          </button>
        </div>
        
        {codeResult?.code && (
          <>
            {/* Generated Code */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <span className="font-medium text-sm text-gray-700">Código generado</span>
                <button 
                  type="button" 
                  className="text-gray-500 hover:text-gray-700 p-1" 
                  title="Copiar código"
                  onClick={copyCode}
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
              <div className="p-4 bg-gray-50">
                <pre className="overflow-x-auto">
                  <code className={`language-${selectedLanguage} text-sm font-mono`}>
                    {codeResult.code}
                  </code>
                </pre>
              </div>
            </div>
            
            {/* Explanation */}
            {codeResult.explanation && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Explicación:</h3>
                <div className="p-4 bg-gray-50 rounded-lg text-sm">
                  <p className="whitespace-pre-wrap">{codeResult.explanation}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProgrammingTab;
