import fetch from 'node-fetch';

// API key - API directa proporcionada por el usuario
const API_KEY = 'AIzaSyDPuYdIpD29eODV4CeaooCEcgiTpIKh1N4';

// API Endpoint URLs 
const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
const modelEndpoint = `${baseUrl}/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Safety settings for API requests
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  }
];

// Helper function to make API requests
async function makeApiRequest(content: any) {
  try {
    const requestBody = {
      contents: [{ parts: content }],
      safetySettings: safetySettings,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(modelEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
}

export async function generateChatResponse(history: { role: string; content: string }[], newMessage: string) {
  try {
    // Preparar el mensaje que se enviará a la API
    const parts = [{ text: `Previous conversation: ${JSON.stringify(history)}\n\nUser message: ${newMessage}\n\nPlease respond to the user message.` }];
    
    // Hacer la solicitud a la API
    const data = await makeApiRequest(parts);

    // Extraer la respuesta
    if (data && data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content;
      if (content && content.parts && content.parts.length > 0) {
        const responseText = content.parts[0].text;
        return { success: true, message: responseText };
      }
    }

    throw new Error('No valid response from API');
  } catch (error) {
    console.error('Error generating chat response:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function analyzeImage(imageData: string, prompt: string = "Describe this image in detail") {
  try {
    // Prepare image data
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    // Prepare content for the API request
    const parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      }
    ];
    
    // Make API request
    const data = await makeApiRequest(parts);

    // Extract response text
    if (data && data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content;
      if (content && content.parts && content.parts.length > 0) {
        const responseText = content.parts[0].text;
        return { success: true, analysis: responseText };
      }
    }

    throw new Error('No valid response from API');
  } catch (error) {
    console.error('Error analyzing image:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function translateText(text: string, sourceLanguage: string, targetLanguage: string) {
  try {
    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}:\n\n"${text}"\n\nOnly provide the translated text without any additional explanations.`;
    
    // Prepare content for the API request
    const parts = [{ text: prompt }];
    
    // Make API request
    const data = await makeApiRequest(parts);

    // Extract response text
    if (data && data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content;
      if (content && content.parts && content.parts.length > 0) {
        const responseText = content.parts[0].text;
        return { success: true, translation: responseText };
      }
    }

    throw new Error('No valid response from API');
  } catch (error) {
    console.error('Error translating text:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function generateCode(prompt: string, language: string) {
  try {
    const promptWithLang = `Generate code in ${language} that satisfies the following requirements:\n\n${prompt}\n\nPlease provide well-commented, clean code with no additional explanations or markdown formatting.`;
    
    // Prepare content for code generation
    const codeParts = [{ text: promptWithLang }];
    
    // Make API request for code
    const codeData = await makeApiRequest(codeParts);

    // Extract code
    let code = '';
    if (codeData && codeData.candidates && codeData.candidates.length > 0) {
      const content = codeData.candidates[0].content;
      if (content && content.parts && content.parts.length > 0) {
        code = content.parts[0].text;
        // Clean up the code (remove markdown code fences if present)
        code = code.replace(/```\w*\n/g, '').replace(/```$/g, '').trim();
      }
    }

    if (!code) {
      throw new Error('Failed to generate code');
    }

    // Generate an explanation
    const explanationPrompt = `Explain the following ${language} code, focusing on its functionality, algorithms used, and any optimizations. Be concise and clear:\n\n${code}`;
    
    // Prepare content for explanation
    const explanationParts = [{ text: explanationPrompt }];
    
    // Make API request for explanation
    const explanationData = await makeApiRequest(explanationParts);

    // Extract explanation
    let explanation = '';
    if (explanationData && explanationData.candidates && explanationData.candidates.length > 0) {
      const content = explanationData.candidates[0].content;
      if (content && content.parts && content.parts.length > 0) {
        explanation = content.parts[0].text;
      }
    }

    return { 
      success: true, 
      code, 
      explanation: explanation || 'No explanation available.', 
      language 
    };
  } catch (error) {
    console.error('Error generating code:', error);
    return { success: false, error: (error as Error).message };
  }
}