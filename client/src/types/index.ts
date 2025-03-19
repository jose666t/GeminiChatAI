export type Message = {
  role: 'user' | 'model';
  content: string;
};

export type TabId = 'chat' | 'image-analysis' | 'translation' | 'programming';

export type Language = {
  code: string;
  name: string;
};

export type CodeLanguage = {
  value: string;
  label: string;
};

export type ImageAnalysisResult = {
  success: boolean;
  analysis?: string;
  error?: string;
};

export type TranslationResult = {
  success: boolean;
  translation?: string;
  error?: string;
};

export type CodeGenerationResult = {
  success: boolean;
  code?: string;
  explanation?: string;
  language?: string;
  error?: string;
};

export type ChatResponse = {
  success: boolean;
  message?: string;
  error?: string;
};
