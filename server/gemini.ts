import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Generic text-only model
const getGeminiProModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

// Vision-capable model 
// Using gemini-2.0-flash también para visión ya que gemini-2.0-flash soporta imágenes
const getGeminiProVisionModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

// Safety settings
const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function generateChatResponse(history: { role: string; content: string }[], newMessage: string) {
  try {
    const model = getGeminiProModel();
    
    // Ensure history starts with user message or is empty
    const validHistory = history.length > 0 
      ? (history[0].role === 'user' ? history : [])
      : [];
    
    // Build a valid chat history for Gemini
    const chat = model.startChat({
      history: validHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      safetySettings: safetySetting,
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    const text = response.text();

    return { success: true, message: text };
  } catch (error) {
    console.error('Error generating chat response:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function analyzeImage(imageData: string, prompt: string = "Describe this image in detail") {
  try {
    const model = getGeminiProVisionModel();
    
    // Prepare image data
    // Remove potential data URL prefix and convert base64 to buffer
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg', // Adjust if needed
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    return { success: true, analysis: text };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function translateText(text: string, sourceLanguage: string, targetLanguage: string) {
  try {
    const model = getGeminiProModel();
    
    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n"${text}"\n\nOnly provide the translated text without any additional explanations.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    return { success: true, translation: translatedText };
  } catch (error) {
    console.error('Error translating text:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function generateCode(prompt: string, language: string) {
  try {
    const model = getGeminiProModel();
    
    const promptWithLang = `Generate code in ${language} that satisfies the following requirements:\n\n${prompt}\n\nPlease provide well-commented, clean code with no additional explanations or markdown formatting.`;
    
    // Generate the code
    const codeResult = await model.generateContent(promptWithLang);
    const codeResponse = await codeResult.response;
    let code = codeResponse.text();
    
    // Clean up the code (remove markdown code fences if present)
    code = code.replace(/```\w*\n/g, '').replace(/```$/g, '').trim();
    
    // Generate an explanation in a separate request
    const explanationPrompt = `Explain the following ${language} code, focusing on its functionality, algorithms used, and any optimizations. Be concise and clear:\n\n${code}`;
    const explanationResult = await model.generateContent(explanationPrompt);
    const explanationResponse = await explanationResult.response;
    const explanation = explanationResponse.text();

    return { 
      success: true, 
      code, 
      explanation, 
      language 
    };
  } catch (error) {
    console.error('Error generating code:', error);
    return { success: false, error: (error as Error).message };
  }
}
