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
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Background overlay with subtle gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
            zIndex: 1,
          }}
        />

        {/* Content container */}
        <div
          style={{
            background: 'rgba(24, 24, 27, 0.95)',
            border: '1px solid rgba(63, 63, 70, 0.4)',
            borderRadius: '20px',
            padding: '60px',
            maxWidth: '900px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 2,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Blog title */}
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#f4f4f5',
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
              color: '#a1a1aa',
              margin: '0 0 40px 0',
              lineHeight: '1.4',
              maxWidth: '700px',
            }}
          >
            {blogPost.description}
          </p>

          {/* Author and metadata */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              fontSize: '18px',
              color: '#71717a',
            }}
          >
            <span style={{ fontWeight: '600' }}>
              {blogPost.author || 'Mohammed Mostafa'}
            </span>
            {blogPost.date && (
              <>
                <span>•</span>
                <span>{blogPost.date}</span>
              </>
            )}
            {blogPost.readTime && (
              <>
                <span>•</span>
                <span>{blogPost.readTime} read</span>
              </>
            )}
          </div>

          {/* Brand/Logo area */}
          <div
            style={{
              marginTop: '40px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
              color: '#a1a1aa',
              fontWeight: '500',
            }}
          >
            mohammedd.tech
          </div>
        </div>

        {/* Decorative elements with dark theme colors */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.1)',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.1)',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.08)',
            zIndex: 1,
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