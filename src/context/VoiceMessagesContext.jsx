import React, { createContext, useState, useContext } from 'react';

// Create context
const VoiceMessagesContext = createContext();

// Context provider component
export const VoiceMessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  // Add a new voice message
  const addMessage = (audioBlob, title = '', duration = null) => {
    const newMessage = {
      id: Date.now().toString(),
      audioBlob,
      title,
      timestamp: Date.now(),
      duration
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage.id;
  };

  // Delete a voice message
  const deleteMessage = (messageId) => {
    setMessages(prevMessages => 
      prevMessages.filter(message => message.id !== messageId)
    );
  };

  // Update a voice message
  const updateMessage = (messageId, updates) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === messageId ? { ...message, ...updates } : message
      )
    );
  };

  // Get all messages
  const getAllMessages = () => {
    return [...messages];
  };

  // Get a specific message by ID
  const getMessageById = (messageId) => {
    return messages.find(message => message.id === messageId);
  };

  // Context value
  const value = {
    messages,
    addMessage,
    deleteMessage,
    updateMessage,
    getAllMessages,
    getMessageById
  };

  return (
    <VoiceMessagesContext.Provider value={value}>
      {children}
    </VoiceMessagesContext.Provider>
  );
};

// Custom hook to use the voice messages context
export const useVoiceMessages = () => {
  const context = useContext(VoiceMessagesContext);
  if (context === undefined) {
    throw new Error('useVoiceMessages must be used within a VoiceMessagesProvider');
  }
  return context;
};

export default VoiceMessagesContext;