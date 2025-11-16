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
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Inter, sans-serif',
          background: 'linear-gradient(135deg, #050505 0%, #111113 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft glossy light blobs */}
        <div
          style={{
            position: 'absolute',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)',
            top: '-180px',
            left: '-180px',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(120,120,120,0.08), transparent 70%)',
            bottom: '-140px',
            right: '-140px',
            filter: 'blur(40px)',
          }}
        />

        {/* Main glossy glass card */}
        <div
          style={{
            width: '100%',
            maxWidth: '980px',
            padding: '80px 70px',
            borderRadius: '34px',
            background: 'rgba(20,20,22,0.55)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(25px) brightness(1.15)',
            WebkitBackdropFilter: 'blur(25px) brightness(1.15)',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.45), inset 0 2px 25px rgba(255,255,255,0.05)',
            position: 'relative',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >

          {/* Glossy highlight streak */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '140px',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.02) 80%, transparent 100%)',
              borderRadius: '34px 34px 0 0',
              pointerEvents: 'none',
            }}
          />

          {/* Title */}
          <h1
            style={{
              fontSize: '60px',
              fontWeight: '900',
              color: '#fafafa',
              margin: '0 0 30px 0',
              lineHeight: '1.1',
              maxWidth: '820px',
              textShadow: '0 0 12px rgba(255,255,255,0.1)',
            }}
          >
            {blogPost.title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '28px',
              color: '#d7d7dc',
              margin: '0 0 50px 0',
              lineHeight: '1.5',
              maxWidth: '740px',
              textShadow: '0 0 8px rgba(255,255,255,0.06)',
            }}
          >
            {blogPost.description}
          </p>

          {/* Metadata pill — soft matte glass */}
          <div
            style={{
              display: 'flex',
              gap: '18px',
              fontSize: '20px',
              color: '#cfd0d1',
              padding: '14px 30px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow:
                'inset 0 0 10px rgba(255,255,255,0.06), 0 0 18px rgba(0,0,0,0.2)',
            }}
          >
            <span style={{ color: '#f7f7f8', fontWeight: '600' }}>
              {blogPost.author || 'Mohammed Mostafa'}
            </span>

            {blogPost.readTime && (
              <>
                <span style={{ color: '#8f8f96' }}>•</span>
                <span>{blogPost.readTime} read</span>
              </>
            )}
          </div>

          {/* Brand */}
          <div
            style={{
              marginTop: '55px',
              fontSize: '22px',
              fontWeight: '700',
              color: '#e5e7eb',
              padding: '10px 28px',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow:
                'inset 0 0 10px rgba(255,255,255,0.05), 0 0 18px rgba(0,0,0,0.25)',
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
