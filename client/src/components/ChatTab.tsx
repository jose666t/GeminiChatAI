import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const ChatTab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      content: 'Hola, soy Gemini. ¿En qué puedo ayudarte hoy?' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: inputMessage
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/chat', {
        messages,
        newMessage: userMessage.content
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [
          ...prev, 
          { role: 'model', content: data.message }
        ]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error sending message',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4" id="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex items-start space-x-2 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex-shrink-0 flex items-center justify-center">
                <i className="fas fa-robot text-white text-xs"></i>
              </div>
            )}
            
            <div className={`${
              message.role === 'user' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100'
              } rounded-lg p-3 max-w-[80%]`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                <i className="fas fa-user text-gray-600 text-xs"></i>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4">
        <form className="flex items-end space-x-2" onSubmit={handleSubmit}>
          <div className="flex-grow">
            <textarea 
              rows={2} 
              id="chat-input" 
              placeholder="Escribe tu mensaje aquí..." 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <i className="fas fa-circle-notch fa-spin mr-2"></i>
            ) : (
              <i className="fas fa-paper-plane mr-2"></i>
            )}
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;
