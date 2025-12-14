'use client';

import { ChatProvider } from 'react-chat-agent'
import { ChatInterface } from '@/components/Chats'
import { ErrorModal } from '@/components/ui/modals'
import 'react-chat-agent/ui.css'

interface ChatViewProps {
  authConfig: { sessionId: string; accessToken: string } | null
  isLoadingSession: boolean
  pendingMessage: string
  onBackToHome: () => void
  onCreateSession: () => Promise<void>
  onClearPendingMessage: () => void
  onError: (error: any) => void
  errorModalOpen: boolean
  closeErrorModal: () => void
  currentError: any
}

export default function ChatView({
  authConfig,
  isLoadingSession,
  pendingMessage,
  onBackToHome,
  onCreateSession,
  onClearPendingMessage,
  onError,
  errorModalOpen,
  closeErrorModal,
  currentError,
}: ChatViewProps) {
  // Show loading state while creating session
  if (isLoadingSession || !authConfig) {
    return (
      <div className="fixed inset-0 h-screen w-screen bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/40">Creating chat session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black z-50">
      <ChatProvider 
        authConfig={authConfig}
        onError={onError}
        typingAnimation={{ mode: 'word', speed: 30 }}
        initialWelcome={{
          title: 'Welcome to My personal assistant',
          description: 'Ask me anything about my projects, work experience, blog posts, etc.'
        }}
      >
        <ChatInterface 
          onBackToHome={onBackToHome} 
          onCreateSession={onCreateSession}
          pendingMessage={pendingMessage}
          onMessageSent={onClearPendingMessage}
        />
      </ChatProvider>
      
      {/* Error Modal */}
      <ErrorModal 
        isOpen={errorModalOpen}
        onClose={closeErrorModal}
        error={currentError}
      />
    </div>
  )
}
