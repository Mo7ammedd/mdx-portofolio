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
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Main content container */}
        <div
          style={{
            background: 'rgba(17, 17, 19, 0.9)',
            border: '1px solid rgba(63, 63, 70, 0.3)',
            borderRadius: '24px',
            padding: '60px',
            maxWidth: '900px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Blog title */}
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 24px 0',
              lineHeight: '1.2',
              maxWidth: '800px',
            }}
          >
            {blogPost.title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '22px',
              color: '#d4d4d8',
              margin: '0 0 40px 0',
              lineHeight: '1.4',
              maxWidth: '700px',
            }}
          >
            {blogPost.description}
          </p>

          {/* Metadata section */}
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
            {blogPost.readTime && (
              <>
                <span style={{ color: '#71717a' }}>•</span>
                <span>{blogPost.readTime} read</span>
              </>
            )}
          </div>

          {/* Brand section */}
          <div
            style={{
              marginTop: '40px',
              fontSize: '16px',
              color: '#3b82f6',
              fontWeight: '500',
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            mohammedd.tech
          </div>
        </div>
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
