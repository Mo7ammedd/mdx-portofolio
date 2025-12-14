'use client';

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { ProjectCard } from '@/components/project-card'
import { AnimatedContainer, StaticSection, AnimatedSection } from '@/components/home/animated-section'
import { WorkSection } from '@/components/home/work-section'
import { BlogSection } from '@/components/home/blog-section'
import { ConnectSection } from '@/components/home/connect-section'
import { SpotifySection } from '@/components/home/spotify-section'
import ChatInput from '@/components/ChatInput'
// Use lightweight session helpers - no heavy dependencies
import { 
  getOrCreateFingerprint, 
  storeSession, 
  getStoredSession 
} from '@/lib/session'
// Use lightweight modals - no heavy dependencies
import { ErrorModal } from '@/components/ui/modals'

// Dynamically import heavy chat components - only loaded when chat is opened
const ChatView = dynamic(() => import('@/components/ChatView'), {
  loading: () => (
    <div className="fixed inset-0 h-screen w-screen bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/40">Loading chat...</p>
      </div>
    </div>
  ),
  ssr: false,
})

interface PersonalClientProps {
  projectsWithStats: any[]
  blogPostsWithReadingTime: any[]
  workExperience: any[]
  email: string
  socialLinks: any[]
}

export function PersonalClient({
  projectsWithStats,
  blogPostsWithReadingTime,
  workExperience,
  email,
  socialLinks,
}: PersonalClientProps) {
  const [chatOpen, setChatOpen] = useState(false)
  const [authConfig, setAuthConfig] = useState<{ sessionId: string; accessToken: string } | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<string>("")
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [currentError, setCurrentError] = useState<any>(null)

  const clearPendingMessage = useCallback(() => {
    setPendingMessage("")
  }, [])

  const handleError = useCallback((error: any) => {
    setCurrentError(error)
    setErrorModalOpen(true)
  }, [])

  const closeErrorModal = useCallback(() => {
    setErrorModalOpen(false)
    setCurrentError(null)
  }, [])

  // Fetch or create guest session
  const fetchSession = useCallback(async () => {
    try {
      const fingerprint = getOrCreateFingerprint()
      
      const res = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint }),
      })
      const data = await res.json()

      if (res.ok) {
        const config = {
          sessionId: data.sessionId,
          accessToken: data.accessToken,
        }
        setAuthConfig(config)
        storeSession(config.sessionId, config.accessToken)
        return config
      } else {
        console.error('Failed to create session:', data.error)
        return null
      }
    } catch (error) {
      console.error('Error creating session:', error)
      return null
    }
  }, [])

  // Create guest session when user submits message
  const handleChatSubmit = async (message: string) => {
    setPendingMessage(message)
    setChatOpen(true)
    setIsLoadingSession(true)

    try {
      // First check if we have a stored session
      const stored = getStoredSession()
      if (stored) {
        setAuthConfig(stored)
      } else {
        // Create new session
        const config = await fetchSession()
        if (!config) {
          alert('Failed to create chat session. Please try again.')
          setChatOpen(false)
          setPendingMessage("")
          return
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error)
      alert('Failed to initialize chat. Please try again.')
      setChatOpen(false)
      setPendingMessage("")
    } finally {
      setIsLoadingSession(false)
    }
  }

  const handleCreateSession = useCallback(async () => {
    // Create a new session (for "New Chat" button)
    try {
      const config = await fetchSession()
      if (config) {
        setAuthConfig(config)
        console.log('New session created:', config.sessionId)
        // Force remount of ChatProvider by toggling chatOpen
        setChatOpen(false)
        setTimeout(() => setChatOpen(true), 100)
      }
    } catch (error) {
      console.error('Error creating new session:', error)
    }
  }, [fetchSession])

  const handleBackToHome = useCallback(() => {
    setChatOpen(false)
    // Don't clear authConfig - keep session for when they return
  }, [])

  // Chat view - lazy loaded
  if (chatOpen) {
    return (
      <ChatView
        authConfig={authConfig}
        isLoadingSession={isLoadingSession}
        pendingMessage={pendingMessage}
        onBackToHome={handleBackToHome}
        onCreateSession={handleCreateSession}
        onClearPendingMessage={clearPendingMessage}
        onError={handleError}
        errorModalOpen={errorModalOpen}
        closeErrorModal={closeErrorModal}
        currentError={currentError}
      />
    )
  }

  // Home view
  return (
    <>
      <AnimatedContainer className="space-y-24">
        <section className="opacity-100">
          <div className="flex-1">
            <h1 className="sr-only">Mohammed Mostafa - Mohammed Software Engineer Portfolio</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              I am Mohammed Mostafa, a Software Engineer and recent Computer Science graduate from Suez Canal University. As a dedicated software engineer, I have a deep passion for building systems that are strong, efficient, and easy to use. I focus on backend development, where I design and develop reliable solutions that help applications run smoothly. I love solving problems and turning ideas into real, working systems.
            </p>
          </div>
        </section>

        <ChatInput onSubmit={handleChatSubmit} />
        
        <StaticSection>
          <h3 className="mb-5 text-lg font-medium">Selected Projects</h3>
          <div className="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
            {projectsWithStats.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                tags={project.technologies}
                links={project.links}
                githubStats={project.githubStats}
              />
            ))}
          </div>
        </StaticSection>

        <AnimatedSection>
          <h3 className="mb-5 text-lg font-medium">Work Experience</h3>
          <WorkSection jobs={workExperience} />
        </AnimatedSection>

        <AnimatedSection>
          <h3 className="mb-3 text-lg font-medium">Blog</h3>
          <BlogSection posts={blogPostsWithReadingTime} />
        </AnimatedSection>

        <AnimatedSection>
          <SpotifySection />
        </AnimatedSection>

        <AnimatedSection>
          <ConnectSection email={email} socialLinks={socialLinks} />
        </AnimatedSection>
      </AnimatedContainer>

      {/* Error Modal for home view */}
      <ErrorModal 
        isOpen={errorModalOpen}
        onClose={closeErrorModal}
        error={currentError}
      />
    </>
  )
}
