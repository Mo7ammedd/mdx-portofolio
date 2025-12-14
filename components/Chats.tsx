'use client';
import { useState, useEffect, useCallback, useRef } from "react";
import { ChatCore, useChatContext } from "react-chat-agent";
import { ConfirmModal, Toast } from "@/components/ui/modals";

// Generate or retrieve user fingerprint from localStorage
export function getOrCreateFingerprint(): string {
  const FINGERPRINT_KEY = 'oblien_user_fingerprint';
  
  let fingerprint = localStorage.getItem(FINGERPRINT_KEY);
  
  if (!fingerprint) {
    // Generate a unique fingerprint
    fingerprint = `fp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(FINGERPRINT_KEY, fingerprint);
  }
  
  return fingerprint;
}

// Store session in localStorage
export function storeSession(sessionId: string, accessToken: string) {
  localStorage.setItem('oblien_session', JSON.stringify({
    sessionId,
    accessToken,
    timestamp: Date.now(),
  }));
}

// Retrieve session from localStorage
export function getStoredSession(): { sessionId: string; accessToken: string } | null {
  try {
    const stored = localStorage.getItem('oblien_session');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error parsing stored session:', error);
  }
  return null;
}

// Chat Interface Component - integrates ChatCore with custom ChatInput
export function ChatInterface({ 
  onBackToHome, 
  onCreateSession,
  pendingMessage,
  onMessageSent 
}: { 
  onBackToHome: () => void; 
  onCreateSession: () => void;
  pendingMessage: string;
  onMessageSent: () => void;
}) {
  const coreRef = useRef(null);
  const { sendMsg, isStreaming, abort, isInitialLoading, messages } = useChatContext();
  const [isMounted, setIsMounted] = useState(false);
  const [coreReady, setCoreReady] = useState(false);

  // Delay mounting ChatCore to avoid flushSync issues
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Mark core as ready after it's mounted and rendered
  useEffect(() => {
    if (isMounted && !isInitialLoading) {
      const timer = setTimeout(() => {
        setCoreReady(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isMounted, isInitialLoading]);

  const handleSendMessage = useCallback(async (messageData: { message: string }) => {
    await sendMsg(messageData);
    // Auto-scroll after sending
    setTimeout(() => {
      // @ts-ignore
      coreRef.current?.scrollToBottom();
    }, 100);
  }, [sendMsg]);

  // Send pending message once ChatCore is fully ready
  useEffect(() => {
    if (coreReady && pendingMessage) {
      handleSendMessage({ message: pendingMessage });
      onMessageSent();
    }
  }, [coreReady, pendingMessage, handleSendMessage, onMessageSent]);

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Header with back button and logo */}
      <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-4">
      <button
        onClick={onBackToHome}
          className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>
        
        {/* Logo */}
        <div className="text-xs text-white/40 font-light tracking-wider">
          Mohammed Mostafa
        </div>
      </div>

      {/* Chat messages container */}
      <div className="flex-1 w-full max-w-3xl mx-auto overflow-hidden">
        {isMounted ? (
        <ChatCore
          ref={coreRef}
          isDark={true}
          allowEditMessage={false}
          className="h-full px-4 pt-20 pb-4"
        />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Chat input at bottom */}
      <div className="sticky bottom-0 w-full flex justify-center pb-4 sm:pb-8 px-4 bg-gradient-to-t from-black via-black to-transparent pt-4">
        <div className="w-full max-w-3xl">
          <ChatInputWrapper onSendMessage={handleSendMessage} isStreaming={isStreaming} abort={abort} onNewSession={onCreateSession} />
        </div>
      </div>
    </div>
  );
}

// Wrapper for custom ChatInput to handle message sending
export function ChatInputWrapper({ onSendMessage, isStreaming, abort, onNewSession }: any) {
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isStreaming) {
      onSendMessage({ message: message.trim() });
      setMessage("");
    }
  };

  const handleStop = () => {
    abort();
  };

  const handleNewSession = () => {
    setShowConfirmModal(true);
  };

  const confirmNewSession = () => {
    setShowConfirmModal(false);
    onNewSession();
  };

  const handleVoiceClick = () => {
    setShowToast(true);
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <div className="group relative flex items-center rounded-full bg-white/5 backdrop-blur-sm transition-all duration-300 border border-white/10">
        <button
          type="button"
            onClick={handleNewSession}
            className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center text-white/50 transition-colors hover:text-white/80 flex-shrink-0"
            aria-label="New chat session"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything"
          disabled={isStreaming}
            className="flex-1 bg-transparent py-3 sm:py-4 pr-2 sm:pr-4 text-sm text-white placeholder-white/30 outline-none sm:text-base disabled:opacity-50 min-w-0"
        />
        
        <button
          type="button"
            onClick={handleVoiceClick}
            className="mr-1 sm:mr-2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-white/50 transition-colors hover:text-white/80 flex-shrink-0"
          aria-label="Voice input"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        
        {isStreaming ? (
          <button
            type="button"
            onClick={handleStop}
              className="mr-1 sm:mr-2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 flex-shrink-0"
            aria-label="Stop generation"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!message.trim()}
              className="mr-1 sm:mr-2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-black transition-all hover:bg-white/90 active:scale-95 disabled:opacity-30 disabled:hover:bg-white flex-shrink-0"
            aria-label="Send message"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        )}
      </div>
    </form>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmNewSession}
        title="Create New Session"
        message="Current conversation will be saved. Are you sure you want to start a new session?"
      />

      <Toast
        message="🎤 Voice input coming soon!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}