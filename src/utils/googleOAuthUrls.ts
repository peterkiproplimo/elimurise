/**
 * Google OAuth 2.0 URL Helpers
 * 
 * This module provides utility functions for generating Google OAuth 2.0 URLs
 * and handling the OAuth 2.0 flow in the frontend.
 */

import { GOOGLE_OAUTH } from './constants';

// Get Google Client ID from environment variables
const getGoogleClientId = (): string => {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
};

// Get the redirect URI for OAuth callback
const getRedirectUri = (): string => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?oauth=google`;
  }
  return '';
};

/**
 * Generate Google OAuth 2.0 Authorization URL
 * 
 * @param options - OAuth options
 * @returns Complete authorization URL
 */
export const generateGoogleAuthUrl = (options: {
  clientId?: string;
  redirectUri?: string;
  scope?: string;
  state?: string;
  accessType?: 'online' | 'offline';
  prompt?: 'none' | 'consent' | 'select_account';
  responseType?: 'code' | 'token' | 'id_token' | 'code id_token';
} = {}): string => {
  const clientId = options.clientId || getGoogleClientId();
  const redirectUri = options.redirectUri || getRedirectUri();
  const scope = options.scope || GOOGLE_OAUTH.SCOPES.DRIVE_UPLOAD;
  const state = options.state || generateRandomState();
  const accessType = options.accessType || 'offline'; // offline for refresh tokens
  const prompt = options.prompt || 'consent'; // consent to force token refresh
  const responseType = options.responseType || 'code';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    scope: scope,
    access_type: accessType,
    prompt: prompt,
    state: state,
  });

  return `${GOOGLE_OAUTH.AUTH_URL}?${params.toString()}`;
};

/**
 * Generate state parameter for OAuth flow
 * This helps prevent CSRF attacks
 */
export const generateRandomState = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Generate token exchange URL
 * 
 * @param code - Authorization code from OAuth callback
 * @param redirectUri - Redirect URI used in authorization
 * @returns Complete token exchange URL
 */
export const generateTokenExchangeUrl = (
  code: string,
  redirectUri?: string
): string => {
  const clientId = getGoogleClientId();
  const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '';

  const params = new URLSearchParams({
    code: code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri || getRedirectUri(),
    grant_type: 'authorization_code',
  });

  return `${GOOGLE_OAUTH.TOKEN_URL}?${params.toString()}`;
};

/**
 * Generate access token refresh URL
 * 
 * @param refreshToken - Refresh token from initial authorization
 * @returns Token refresh URL
 */
export const generateTokenRefreshUrl = (refreshToken: string): string => {
  const clientId = getGoogleClientId();
  const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '';

  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  });

  return `${GOOGLE_OAUTH.TOKEN_URL}?${params.toString()}`;
};

/**
 * Generate revoke access URL
 * 
 * @param token - Access token or refresh token to revoke
 * @returns Revoke URL
 */
export const generateRevokeTokenUrl = (token: string): string => {
  return `${GOOGLE_OAUTH.REVOKE_URL}?token=${token}`;
};

/**
 * Get user info URL
 * 
 * @param accessToken - Access token
 * @returns User info URL with token
 */
export const generateUserInfoUrl = (accessToken: string): string => {
  return `${GOOGLE_OAUTH.USER_INFO_URL}?access_token=${accessToken}`;
};

/**
 * Get Google Drive file URL
 * 
 * @param fileId - Google Drive file ID
 * @param accessToken - Access token
 * @returns Google Drive API URL
 */
export const generateDriveFileUrl = (
  fileId: string,
  accessToken?: string
): string => {
  let url = `${GOOGLE_OAUTH.DRIVE_API_BASE}/files/${fileId}`;
  if (accessToken) {
    url += `?access_token=${accessToken}`;
  }
  return url;
};

/**
 * Get Google Drive upload URL
 * 
 * @param uploadType - Type of upload (multipart, resumable, media)
 * @returns Upload URL
 */
export const generateDriveUploadUrl = (
  uploadType: 'multipart' | 'resumable' | 'media' = 'multipart'
): string => {
  return `${GOOGLE_OAUTH.DRIVE_UPLOAD_BASE}/files?uploadType=${uploadType}`;
};

/**
 * Build complete Google Drive API URL with query parameters
 * 
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @returns Complete URL
 */
export const buildDriveApiUrl = (
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): string => {
  const url = new URL(endpoint, GOOGLE_OAUTH.DRIVE_API_BASE);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  
  return url.toString();
};

/**
 * Get all available OAuth scopes
 */
export const getAvailableScopes = () => GOOGLE_OAUTH.SCOPES;

/**
 * Build scope string from array of scope keys
 * 
 * @param scopeKeys - Array of scope keys from GOOGLE_OAUTH.SCOPES
 * @returns Space-separated scope string
 */
export const buildScopeString = (scopeKeys: string[]): string => {
  return scopeKeys
    .map(key => GOOGLE_OAUTH.SCOPES[key as keyof typeof GOOGLE_OAUTH.SCOPES])
    .filter(Boolean)
    .join(' ');
};

/**
 * Validate if URL is from OAuth callback
 * 
 * @param url - Current URL
 * @returns True if URL contains OAuth callback parameters
 */
export const isOAuthCallback = (url: string = window.location.href): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.has('code') || urlObj.searchParams.has('state');
  } catch {
    return false;
  }
};

/**
 * Extract OAuth parameters from URL
 * 
 * @param url - Current URL
 * @returns OAuth parameters (code, state, error, error_description)
 */
export const extractOAuthParams = (
  url: string = window.location.href
): {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
} => {
  try {
    const urlObj = new URL(url);
    return {
      code: urlObj.searchParams.get('code') || undefined,
      state: urlObj.searchParams.get('state') || undefined,
      error: urlObj.searchParams.get('error') || undefined,
      error_description: urlObj.searchParams.get('error_description') || undefined,
    };
  } catch {
    return {};
  }
};

// Export all functions as default object for easier imports
export default {
  generateGoogleAuthUrl,
  generateRandomState,
  generateTokenExchangeUrl,
  generateTokenRefreshUrl,
  generateRevokeTokenUrl,
  generateUserInfoUrl,
  generateDriveFileUrl,
  generateDriveUploadUrl,
  buildDriveApiUrl,
  getAvailableScopes,
  buildScopeString,
  isOAuthCallback,
  extractOAuthParams,
};
