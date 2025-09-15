import React from 'react'
import { ImageResponse } from '@vercel/og'

export interface BlogPostMeta {
  title: string
  description: string
  author?: string
  date?: string
  readTime?: string
}

export async function generateOGImage(blogPost: BlogPostMeta): Promise<Buffer> {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1a1a1a 75%, #0a0a0a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Simplified background effects */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
            zIndex: 1,
          }}
        />

        {/* Main content container */}
        <div
          style={{
            background: 'rgba(17, 17, 19, 0.85)',
            border: '1px solid rgba(63, 63, 70, 0.3)',
            borderRadius: '24px',
            padding: '60px',
            maxWidth: '900px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 3,
            position: 'relative',
          }}
        >

          {/* Blog title with enhanced styling */}
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ffffff 0%, #e4e4e7 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0 0 24px 0',
              lineHeight: '1.2',
              maxWidth: '800px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {blogPost.title}
          </h1>

          {/* Description with subtle glow */}
          <p
            style={{
              fontSize: '22px',
              color: '#d4d4d8',
              margin: '0 0 40px 0',
              lineHeight: '1.4',
              maxWidth: '700px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            {blogPost.description}
          </p>

          {/* Enhanced metadata section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              fontSize: '18px',
              color: '#a1a1aa',
              background: 'rgba(39, 39, 42, 0.4)',
              padding: '12px 24px',
              borderRadius: '12px',
              border: '1px solid rgba(63, 63, 70, 0.2)',
            }}
          >
            <span style={{ 
              fontWeight: '600',
              color: '#e4e4e7'
            }}>
              {blogPost.author || 'Mohammed Mostafa'}
            </span>
            {blogPost.date && (
              <>
                <span style={{ color: '#71717a' }}>•</span>
                <span>{blogPost.date}</span>
              </>
            )}
            {blogPost.readTime && (
              <>
                <span style={{ color: '#71717a' }}>•</span>
                <span>{blogPost.readTime} read</span>
              </>
            )}
          </div>

          {/* Enhanced brand section */}
          <div
            style={{
              marginTop: '40px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
              color: '#a1a1aa',
              fontWeight: '500',
              background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            mohammedd.tech
          </div>
        </div>

        {/* Enhanced floating orbs with glassy effect */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '8%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `
              radial-gradient(circle at 30% 30%, 
                rgba(59, 130, 246, 0.25) 0%, 
                rgba(59, 130, 246, 0.1) 50%, 
                transparent 100%
              )
            `,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            zIndex: 2,
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '6%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `
              radial-gradient(circle at 30% 30%, 
                rgba(139, 92, 246, 0.25) 0%, 
                rgba(139, 92, 246, 0.1) 50%, 
                transparent 100%
              )
            `,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            zIndex: 2,
            boxShadow: '0 6px 24px rgba(139, 92, 246, 0.2)',
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            top: '45%',
            left: '4%',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: `
              radial-gradient(circle at 30% 30%, 
                rgba(34, 197, 94, 0.2) 0%, 
                rgba(34, 197, 94, 0.08) 50%, 
                transparent 100%
              )
            `,
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(34, 197, 94, 0.15)',
            zIndex: 2,
            boxShadow: '0 4px 16px rgba(34, 197, 94, 0.15)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '15%',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            background: `
              radial-gradient(circle at 30% 30%, 
                rgba(236, 72, 153, 0.2) 0%, 
                rgba(236, 72, 153, 0.08) 50%, 
                transparent 100%
              )
            `,
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(236, 72, 153, 0.15)',
            zIndex: 2,
            boxShadow: '0 3px 12px rgba(236, 72, 153, 0.15)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '65px',
            height: '65px',
            borderRadius: '50%',
            background: `
              radial-gradient(circle at 30% 30%, 
                rgba(245, 158, 11, 0.2) 0%, 
                rgba(245, 158, 11, 0.08) 50%, 
                transparent 100%
              )
            `,
            backdropFilter: 'blur(7px)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            zIndex: 2,
            boxShadow: '0 5px 20px rgba(245, 158, 11, 0.15)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )

  return Buffer.from(await imageResponse.arrayBuffer())
}

export async function generateOGImageForPost(
  title: string,
  description: string,
  options?: {
    author?: string
    date?: string
    readTime?: string
  }
): Promise<Buffer> {
  return generateOGImage({
    title,
    description,
    author: options?.author,
    date: options?.date,
    readTime: options?.readTime,
  })
}