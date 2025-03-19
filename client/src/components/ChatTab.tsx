import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatTab: React.FC = () => {
  // Starting with a welcome message but not sending it to the API
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      content: 'Hola, soy Kira. ¿En qué puedo ayudarte hoy?' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      // Get only messages that should be sent to API (exclude welcome message)
      const apiMessages = messages.slice(1); // Skip welcome message

      const response = await apiRequest('POST', '/api/chat', {
        messages: [...apiMessages, userMessage],
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
      <div className="h-[70vh] md:h-96 overflow-y-auto p-3 md:p-4 space-y-3" id="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                ${message.role === 'user' 
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white ml-4' 
                  : 'bg-gray-100 text-gray-800 mr-4'
                } 
                rounded-2xl py-2 px-3 md:px-4 max-w-[85%] md:max-w-[75%] shadow-sm
                ${message.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}
              `}
            >
              {message.role === 'model' && (
                <div className="text-xs font-medium text-primary mb-1">Kira</div>
              )}
              <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-2 md:p-4 bg-gray-50">
        <form className="flex items-center gap-2" onSubmit={handleSubmit}> {/* Changed to items-center */}
          <div className="flex-grow">
            <textarea 
              rows={isMobile ? 1 : 2} 
              id="chat-input" 
              placeholder="Escribe tu mensaje aquí..." 
              className="w-full border border-gray-200 rounded-full md:rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none shadow-sm"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white rounded-full w-10 h-10 md:w-auto md:h-auto md:rounded-lg md:px-4 md:py-2 flex items-center justify-center shadow-sm transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <i className="fas fa-circle-notch fa-spin md:mr-2"></i>
            ) : (
              <i className="fas fa-paper-plane md:mr-2"></i>
            )}
            <span className="hidden md:inline">Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;