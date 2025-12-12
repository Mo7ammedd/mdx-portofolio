import { NextResponse } from 'next/server';
import { 
  OblienClient, 
  OblienChat, 
  GuestManager, 
  NodeCacheStorage 
} from 'oblien';

// Initialize Oblien client
// TODO: Add these to your .env.local file:
// OBLIEN_API_KEY=your-api-key
// OBLIEN_API_SECRET=your-api-secret
// OBLIEN_AGENT_ID=your-agent-id
const client = new OblienClient({
  apiKey: process.env.OBLIEN_API_KEY || '',
  apiSecret: process.env.OBLIEN_API_SECRET || '',
});

// Initialize guest manager with storage
const guestStorage = new NodeCacheStorage(24 * 60 * 60); // 24 hours TTL
const guestManager = new GuestManager({ 
  storage: guestStorage,
  ttl: 24 * 60 * 60, // 24 hours
});

const chat = new OblienChat(client, { guestManager });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fingerprint } = body;

    if (!fingerprint) {
      return NextResponse.json(
        { error: 'Fingerprint is required' },
        { status: 400 }
      );
    }

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Get agent ID from environment
    const agentId = process.env.OBLIEN_AGENT_ID || '';

    if (!agentId) {
      return NextResponse.json(
        { error: 'OBLIEN_AGENT_ID not configured' },
        { status: 500 }
      );
    }

    // Try to find existing guest (package handles fingerprint/IP mapping internally)
    const existingGuest = await chat.getGuest(ip, fingerprint);
    
    if (existingGuest && existingGuest.sessions && existingGuest.sessions.length > 0) {
      // Guest exists with sessions - return the latest session
      const latestSessionId = existingGuest.sessions[existingGuest.sessions.length - 1];
      
      try {
        // Fetch the session details to get the token
        const sessionDetails = await chat.getSession(latestSessionId);
        
        if (sessionDetails && sessionDetails.token) {
          console.log(`Returning existing session for guest: ${existingGuest.id}`);
          
          return NextResponse.json({
            sessionId: latestSessionId,
            accessToken: sessionDetails.token,
            refreshToken: sessionDetails.token,
            expiresIn: 3600,
            isExisting: true,
            guestId: existingGuest.id,
          });
        }
      } catch (error) {
        console.log('Existing session not found or invalid, creating new one');
      }
    }

    // Create new guest session (package handles fingerprint/IP mapping and guest identification)
    const sessionData = await chat.createGuestSession({
      ip,
      fingerprint,
      agentId,
      metadata: {
        userAgent: request.headers.get('user-agent') || 'unknown',
        referer: request.headers.get('referer') || null,
        timestamp: new Date().toISOString(),
      },
    });

    console.log(`Created new session for guest: ${sessionData.guest.id}`);

    return NextResponse.json({
      sessionId: sessionData.sessionId,
      accessToken: sessionData.token,
      refreshToken: sessionData.token,
      expiresIn: 3600,
      isExisting: false,
      guestId: sessionData.guest.id,
    });
  } catch (error: any) {
    console.error('Error creating guest session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create session' },
      { status: 500 }
    );
  }
}
