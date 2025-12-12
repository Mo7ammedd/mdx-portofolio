import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 400 }
      );
    }

    // For guest sessions, the token doesn't expire
    // Just return the same token
    return NextResponse.json({
      accessToken: refreshToken,
      refreshToken: refreshToken,
      expiresIn: 3600,
    });
  } catch (error: any) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
