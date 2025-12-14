'use client';

// Lightweight session utilities - no heavy dependencies

const FINGERPRINT_KEY = 'oblien_user_fingerprint';
const SESSION_KEY = 'oblien_session';

// Generate or retrieve user fingerprint from localStorage
export function getOrCreateFingerprint(): string {
  if (typeof window === 'undefined') return '';
  
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
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    sessionId,
    accessToken,
    timestamp: Date.now(),
  }));
}

// Retrieve session from localStorage
export function getStoredSession(): { sessionId: string; accessToken: string } | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error parsing stored session:', error);
  }
  return null;
}
