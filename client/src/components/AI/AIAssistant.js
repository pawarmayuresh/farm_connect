import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMutation, useQuery } from 'react-query';
import api from '../../utils/api';
import { Send, Bot, User, Loader2, Sparkles, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const AIAssistant = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const [selectedContext, setSelectedContext] = useState('general');

  const contexts = [
    { id: 'general', name: 'General Farming', icon: '🌾', description: 'General farming advice and tips' },
    { id: 'crops', name: 'Crop Management', icon: '🌱', description: 'Crop growing and management' },
    { id: 'soil', name: 'Soil Health', icon: '🏞️', description: 'Soil testing and improvement' },
    { id: 'pests', name: 'Pest Control', icon: '🐛', description: 'Pest and disease management' },
    { id: 'weather', name: 'Weather Impact', icon: '🌤️', description: 'Weather-related farming decisions' },
    { id: 'technology', name: 'Farm Tech', icon: '🤖', description: 'Modern farming technology' }
  ];

  // Fetch chat history
  const { data: chatData, isLoading, error } = useQuery(
    ['chat-history'],
    async () => {
      const response = await api.get('/ai/chat-history');
      return response.data.chats || [];
    },
    {
      onSuccess: (data) => {
        setChatHistory(data);
      }
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    async (messageData) => {
      const response = await api.post('/ai/chat', messageData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        const newMessage = {
          id: Date.now(),
          type: 'bot',
          content: data.response,
          timestamp: new Date().toISOString(),
          context: selectedContext
        };
        setChatHistory(prev => [...prev, newMessage]);
        setIsTyping(false);
      },
      onError: (error) => {
        toast.error('Failed to send message. Please try again.');
        setIsTyping(false);
      }
    }
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const userMessage = {
      id: Date.now() - 1,
      type: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
      context: selectedContext
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Send to AI
    sendMessageMutation.mutate({
      message: userMessage.content,
      userId: user?.uid,
      farmContext: selectedContext
    });
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const suggestedQuestions = [
    "What's the best time to plant corn in my region?",
    "How can I improve my soil pH naturally?",
    "What are the signs of nutrient deficiency in tomatoes?",
    "How do I control aphids without chemicals?",
    "What cover crops should I plant this fall?",
    "How can I prepare for drought conditions?"
  ];

  const handleSuggestedQuestion = (question) => {
    setMessage(question);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-primary rounded-lg">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI Farm Assistant</h2>
          <p className="text-gray-600">Get expert farming advice and answers to your questions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Contexts */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Farming Contexts
            </h3>
            <div className="space-y-2">
              {contexts.map((context) => (
                <button
                  key={context.id}
                  onClick={() => setSelectedContext(context.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    selectedContext === context.id
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{context.icon}</span>
                    <div>
                      <div className="font-medium">{context.name}</div>
                      <div className="text-xs text-gray-500">{context.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Suggested Questions
            </h3>
            <div className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-primary-300"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <div className="card h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">
                  {contexts.find(c => c.id === selectedContext)?.name} Assistant
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="h-4 w-4" />
                Powered by AI
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to FarmConnect AI!</h3>
                  <p className="text-gray-600 mb-4">
                    Ask me anything about farming, crop management, soil health, and more.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="h-4 w-4" />
                    Select a farming context to get more specific advice
                  </div>
                </div>
              ) : (
                chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        chat.type === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {chat.type === 'user' ? (
                          <User className="h-4 w-4 mt-1 flex-shrink-0" />
                        ) : (
                          <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="text-sm">
                          {chat.content}
                        </div>
                      </div>
                      <div className={`text-xs mt-2 ${
                        chat.type === 'user' ? 'text-primary-200' : 'text-gray-500'
                      }`}>
                        {new Date(chat.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="pt-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me about farming..."
                  className="flex-1 input-field"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isTyping}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 