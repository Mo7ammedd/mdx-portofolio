"use client";

import { useState, useEffect } from "react";

// Toast notification
function Toast({ message, isVisible, onClose }: {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-lg border border-white/10 bg-black/90 backdrop-blur-sm px-4 py-3 shadow-lg">
        <p className="text-sm text-white">{message}</p>
      </div>
    </div>
  );
}

export default function ChatInput({ onSubmit }: { onSubmit?: (message: string) => void }) {
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      if (onSubmit) {
        onSubmit(message.trim());
      }
      setMessage("");
    }
  };

  const handleVoiceClick = () => {
    setShowToast(true);
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <div 
          className={`group relative flex items-center rounded-full bg-white/5 backdrop-blur-sm transition-all duration-300 w-full border border-white/10`}
        >
        <button
          type="button"
            className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center text-white/50 transition-colors hover:text-white/80 flex-shrink-0"
          aria-label="Add attachment"
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
            className="flex-1 bg-transparent py-3 sm:py-4 pr-2 sm:pr-4 text-sm text-white placeholder-white/30 outline-none sm:text-base min-w-0"
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
      </div>
    </form>

      <Toast
        message="🎤 Voice input coming soon!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
