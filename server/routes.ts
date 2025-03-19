import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { generateChatResponse, analyzeImage, translateText, generateCode } from "./gemini_api";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const schema = z.object({
        messages: z.array(z.object({
          role: z.enum(['user', 'model']),
          content: z.string()
        })),
        newMessage: z.string()
      });

      const validatedData = schema.parse(req.body);
      const response = await generateChatResponse(validatedData.messages, validatedData.newMessage);
      res.json(response);
    } catch (error) {
      console.error('Chat API error:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof z.ZodError 
          ? 'Invalid request data' 
          : 'Failed to generate chat response'
      });
    }
  });

  // Image analysis endpoint
  app.post('/api/analyze-image', async (req, res) => {
    try {
      const schema = z.object({
        imageData: z.string(),
        prompt: z.string().optional()
      });

      const validatedData = schema.parse(req.body);
      const response = await analyzeImage(validatedData.imageData, validatedData.prompt);
      res.json(response);
    } catch (error) {
      console.error('Image analysis API error:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof z.ZodError 
          ? 'Invalid request data' 
          : 'Failed to analyze image'
      });
    }
  });

  // Translation endpoint
  app.post('/api/translate', async (req, res) => {
    try {
      const schema = z.object({
        text: z.string(),
        sourceLanguage: z.string(),
        targetLanguage: z.string()
      });

      const validatedData = schema.parse(req.body);
      const response = await translateText(
        validatedData.text, 
        validatedData.sourceLanguage, 
        validatedData.targetLanguage
      );
      res.json(response);
    } catch (error) {
      console.error('Translation API error:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof z.ZodError 
          ? 'Invalid request data' 
          : 'Failed to translate text'
      });
    }
  });

  // Code generation endpoint
  app.post('/api/generate-code', async (req, res) => {
    try {
      const schema = z.object({
        prompt: z.string(),
        language: z.string()
      });

      const validatedData = schema.parse(req.body);
      const response = await generateCode(validatedData.prompt, validatedData.language);
      res.json(response);
    } catch (error) {
      console.error('Code generation API error:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof z.ZodError 
          ? 'Invalid request data' 
          : 'Failed to generate code'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
