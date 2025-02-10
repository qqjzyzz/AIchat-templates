'use client';

import React, { useRef, useEffect } from 'react';
import { DocumentProcessor } from '@/lib/document';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  type: 'user' | 'ai';
}

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onFileUpload: (content: string) => void;
  isProcessing: boolean;
  error: string | null;
}

export function ChatArea({
  messages,
  onSendMessage,
  onFileUpload,
  isProcessing,
  error,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textareaRef.current?.value.trim() || isProcessing) return;
    onSendMessage(textareaRef.current.value);
    textareaRef.current.value = '';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await DocumentProcessor.processWordDocument(file);
      onFileUpload(content);
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  return (
    <div className="chat-area">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <h1 className="welcome-title">Welcome to AI Chat Assistant</h1>
            <p className="welcome-text">
              Start a conversation or upload a document to begin.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.type}-message`}>
              <div className={`message-content ${message.type}`}>
                <div className="message-bubble">
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}
        {isProcessing && (
          <div className="message ai-message">
            <div className="message-content ai">
              <div className="message-bubble loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-area">
        <div className="input-container">
          <div className="input-form">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Type a message..."
              className="input-field"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="button-primary"
              title={isProcessing ? 'Processing...' : 'Send message'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 