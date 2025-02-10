'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import { llmService } from '@/lib/langchain';
import { logger } from '@/utils/logger';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  type: 'user' | 'ai';
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: string;
  tags: string[];
}

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }

    // Initialize LLM service
    const initLLM = async () => {
      try {
        await llmService.initializeModels(
          process.env.NEXT_PUBLIC_OPENAI_API_KEY
        );
        setIsInitialized(true);
        setError(null);
        logger.info('LLM service initialized');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to initialize AI service: ${errorMessage}`);
        logger.error('Failed to initialize LLM service', error);
      }
    };

    initLLM();
  }, []);

  useEffect(() => {
    // Apply dark mode class to document and html
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: new Date().toISOString(),
      tags: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSession(newSession.id);
    return newSession;
  };

  const handleNewChat = () => {
    // 如果当前会话存在且有消息，创建新会话
    if (currentSession && sessions.find(s => s.id === currentSession)?.messages.length) {
      createNewSession();
    } else if (!currentSession) {
      // 如果没有当前会话，创建新会话
      createNewSession();
    }
    // 如果当前会话存在但没有消息，继续使用当前会话
  };

  const getCurrentSession = () => {
    return sessions.find((s) => s.id === currentSession);
  };

  const handleSendMessage = async (content: string) => {
    if (!isInitialized) {
      setError('AI service is not initialized yet. Please wait...');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      let session = getCurrentSession();
      if (!session) {
        session = createNewSession();
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        timestamp: new Date().toISOString(),
        type: 'user',
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === session!.id
            ? {
                ...s,
                messages: [...s.messages, userMessage],
                title: s.messages.length === 0 ? content.slice(0, 30) : s.title,
              }
            : s
        )
      );

      // 检测是否包含代码
      const promptType = content.includes('```') ? 'code' : 'general';
      const response = await llmService.processPrompt(
        content,
        { input: content },
        'openai',
        promptType
      );

      if (!response || !response.response) {
        throw new Error('No response from AI');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        timestamp: new Date().toISOString(),
        type: 'ai',
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === session!.id
            ? { ...s, messages: [...s.messages, aiMessage] }
            : s
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Error: ${errorMessage}`);
      logger.error('Error processing message', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (content: string) => {
    if (!isInitialized) {
      setError('AI service is not initialized yet. Please wait...');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      let session = getCurrentSession();
      if (!session) {
        session = createNewSession();
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        content: 'Uploaded document content:\n' + content.slice(0, 200) + '...',
        timestamp: new Date().toISOString(),
        type: 'user',
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === session!.id
            ? {
                ...s,
                messages: [...s.messages, userMessage],
                title: s.messages.length === 0 ? 'Document Analysis' : s.title,
              }
            : s
        )
      );

      const response = await llmService.processPrompt(
        content,
        { input: content },
        'openai',
        'document'
      );

      if (!response || !response.response) {
        throw new Error('No response from AI');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        timestamp: new Date().toISOString(),
        type: 'ai',
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === session!.id
            ? { ...s, messages: [...s.messages, aiMessage] }
            : s
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Error: ${errorMessage}`);
      logger.error('Error processing document', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="chat-container">
      <Sidebar
        sessions={sessions}
        currentSession={currentSession}
        onSessionSelect={setCurrentSession}
        onSessionDelete={(id) => {
          setSessions((prev) => prev.filter((s) => s.id !== id));
          if (currentSession === id) {
            setCurrentSession(null);
          }
        }}
        onTagAdd={(sessionId, tag) => {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === sessionId
                ? { ...s, tags: [...new Set([...s.tags, tag])] }
                : s
            )
          );
        }}
        onTagRemove={(sessionId, tag) => {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === sessionId
                ? { ...s, tags: s.tags.filter((t) => t !== tag) }
                : s
            )
          );
        }}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        onNewChat={handleNewChat}
      />

      <main className="chat-area">
        <div className="chat-header">
          <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
            <h1 className="text-xl font-semibold">
              {getCurrentSession()?.title || 'Welcome to AI Chat!'}
            </h1>
            <div className="flex items-center gap-4">
              {!isInitialized && (
                <span className="text-yellow-600 dark:text-yellow-400 text-sm">
                  Initializing AI...
                </span>
              )}
              {error && (
                <span className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </span>
              )}
              <button
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="button-secondary"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>

        <ChatArea
          messages={getCurrentSession()?.messages || []}
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          isProcessing={isProcessing}
          error={error}
        />
      </main>
    </div>
  );
} 