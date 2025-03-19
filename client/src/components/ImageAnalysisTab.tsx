import React, { useState, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ImageAnalysisResult } from '@/types';

const ImageAnalysisTab: React.FC = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Formato no válido',
        description: 'Por favor, selecciona una imagen en formato JPG, PNG o GIF.',
        variant: 'destructive'
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB max
      toast({
        title: 'Imagen demasiado grande',
        description: 'El tamaño máximo permitido es 10MB.',
        variant: 'destructive'
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
      analyzeImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const analyzeImage = async (img: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const response = await apiRequest('POST', '/api/analyze-image', {
        imageData: img,
        prompt: "Describe this image in detail. Include any visible details and explain what is shown in the image."
      });
      
      const data = await response.json();
      setAnalysisResult(data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze image');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al analizar la imagen',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetImageAnalysis = () => {
    setImageData(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Análisis de Imágenes</h2>
        
        {!imageData ? (
          // Image Upload
          <div className="mb-6">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer"
              onClick={triggerImageUpload}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
              <div className="mb-4">
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
              </div>
              <p className="text-gray-600 mb-2">Arrastra una imagen aquí o</p>
              <button 
                type="button" 
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Seleccionar imagen
              </button>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF hasta 10MB</p>
            </div>
          </div>
        ) : (
          // Image Preview and Analysis Results
          <div id="image-results">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Preview */}
              <div className="md:w-1/2">
                <h3 className="text-lg font-medium mb-3">Imagen subida:</h3>
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  {imageData && (
                    <img 
                      src={imageData} 
                      alt="Vista previa" 
                      className="w-full object-contain max-h-[300px]" 
                    />
                  )}
                </div>
              </div>
              
              {/* Analysis Results */}
              <div className="md:w-1/2">
                <h3 className="text-lg font-medium mb-3">Análisis de Kira:</h3>
                <div className="h-[240px] md:h-[300px] bg-gray-50 rounded-lg p-4 overflow-y-auto">
                  {isAnalyzing ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ) : (
                    analysisResult?.analysis && (
                      <p className="text-sm whitespace-pre-wrap">{analysisResult.analysis}</p>
                    )
                  )}
                </div>
              </div>
            </div>
            
            {/* Restart Button */}
            <div className="mt-6 text-center">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                onClick={resetImageAnalysis}
              >
                <i className="fas fa-redo mr-2"></i>Analizar otra imagen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalysisTab;
