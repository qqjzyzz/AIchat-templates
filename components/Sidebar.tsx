'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  sessions: Array<{
    id: string;
    title: string;
    messages: Array<{
      id: string;
      content: string;
      timestamp: string;
      type: 'user' | 'ai';
    }>;
    timestamp: string;
    tags: string[];
  }>;
  currentSession: string | null;
  onSessionSelect: (id: string) => void;
  onSessionDelete: (id: string) => void;
  onTagAdd: (sessionId: string, tag: string) => void;
  onTagRemove: (sessionId: string, tag: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
}

export default function Sidebar({
  sessions,
  currentSession,
  onSessionSelect,
  onSessionDelete,
  onTagAdd,
  onTagRemove,
  isCollapsed,
  onToggle,
  onNewChat
}: SidebarProps) {
  return (
    <>
      <button
        onClick={onToggle}
        className={`sidebar-toggle ${!isCollapsed ? 'shifted' : ''}`}
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? (
          <Bars3Icon className="h-5 w-5" />
        ) : (
          <XMarkIcon className="h-5 w-5" />
        )}
      </button>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Chat History</h2>
        </div>
        <div className="sidebar-content">
          <button className="new-chat-button" onClick={onNewChat}>
            <PlusIcon className="h-5 w-5" />
            New Chat
          </button>
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`chat-session ${
                currentSession === session.id ? 'active' : ''
              }`}
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="session-title">{session.title}</div>
              <div className="session-tags">
                {session.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagRemove(session.id, tag);
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSessionDelete(session.id);
                }}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 