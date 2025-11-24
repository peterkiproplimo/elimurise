/**
 * Google Drive Image Upload Service
 * Handles OAuth authentication and image uploads to Google Drive
 */

import axios from 'axios';

// Create a separate axios instance for Google Drive API to avoid global interceptor conflicts
const googleDriveAxios = axios.create();

// Google OAuth Credentials
const GOOGLE_CONFIG = {
  client_id: '1056323070211-jc21517cqebttjhp98sc664ujb83k9bq.apps.googleusercontent.com',
  client_secret: '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',
  redirect_uri: 'http://localhost:5173/home/oauthclientredirect',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  scope: 'https://www.googleapis.com/auth/drive.file'
};

class GoogleImageUploadService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(): string {
    const state = this.generateRandomState();
    
    const params = new URLSearchParams({
      client_id: GOOGLE_CONFIG.client_id,
      redirect_uri: GOOGLE_CONFIG.redirect_uri,
      response_type: 'code',
      scope: GOOGLE_CONFIG.scope,
      access_type: 'offline',
      prompt: 'consent',
      state: state
    });

    return `${GOOGLE_CONFIG.auth_uri}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const params = new URLSearchParams({
        code: code,
        client_id: GOOGLE_CONFIG.client_id,
        client_secret: GOOGLE_CONFIG.client_secret,
        redirect_uri: GOOGLE_CONFIG.redirect_uri,
        grant_type: 'authorization_code'
      });

      const response = await googleDriveAxios.post(GOOGLE_CONFIG.token_uri, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token || localStorage.getItem('google_refresh_token');

      // Store tokens in localStorage
      if (this.accessToken) {
        localStorage.setItem('google_access_token', this.accessToken);
      }
      if (this.refreshToken) {
        localStorage.setItem('google_refresh_token', this.refreshToken);
        try {
          // Send refresh token to backend to persist against specific config ID
          await axios.post(`${import.meta.env.VITE_API_ENDPOINT}google-config/69023ae4a772a5bf53b229fa/refresh-token`, {
            refresh_token: this.refreshToken,
            access_token: this.accessToken
          });
        } catch (persistError) {
          console.warn('Failed to persist refresh token to backend:', persistError);
        }
      }

      return {
        access_token: this.accessToken!,
        refresh_token: this.refreshToken!
      };
    } catch (error: any) {
      console.error('Error exchanging code for token:', error);
      throw new Error(error.response?.data?.error_description || 'Token exchange failed');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.refreshToken || localStorage.getItem('google_refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available. Please sign in again.');
    }

    try {
      const params = new URLSearchParams({
        refresh_token: refreshToken,
        client_id: GOOGLE_CONFIG.client_id,
        client_secret: GOOGLE_CONFIG.client_secret,
        grant_type: 'refresh_token'
      });

      const response = await googleDriveAxios.post(GOOGLE_CONFIG.token_uri, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      if (this.accessToken) {
        localStorage.setItem('google_access_token', this.accessToken);
      }

      return this.accessToken;
    } catch (error: any) {
      console.error('Error refreshing token:', error);
      throw new Error(error.response?.data?.error_description || 'Token refresh failed');
    }
  }


  /**
   * Upload image to Google Drive using multipart upload
   */
  async uploadImage(
    file: File,
    folderId?: string,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    try {

      const accessToken = localStorage.getItem('google_access_token');
      console.log('Access Token from localStorage:', accessToken ? 'EXISTS' : 'MISSING');
      
      if (!accessToken) {
        throw new Error('No Google access token found. Please sign in first.');
      }
      
      console.log('Token used for upload:', accessToken.substring(0, 20) + '...');

      // Use provided folder ID or create "elimurise" folder
      let targetFolderId = folderId;
      
      if (!targetFolderId) {
        const elimuriseFolderId = await this.getOrCreateElimuriseFolder();
        console.log('Uploading to "elimurise" folder with ID:', elimuriseFolderId);
        targetFolderId = elimuriseFolderId;
      }

      const metadata: any = {
        name: file.name,
        mimeType: file.type,
        parents: [targetFolderId]
      };

      // Read file as base64 for multipart upload
      const fileData = await this.readFileAsBase64(file);

      // Create proper multipart body
      const boundary = `----WebKitFormBoundary${Date.now()}`;
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const metadataPart = `Content-Type: application/json\r\n\r\n${JSON.stringify(metadata)}`;
      const filePart = `Content-Type: ${file.type}\r\n\r\n${fileData}`;

      const multipartBody = delimiter + metadataPart + delimiter + filePart + closeDelimiter;

      // Upload to Google Drive
      const response = await googleDriveAxios.post(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,size,mimeType,webViewLink,webContentLink,thumbnailLink',
        multipartBody,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(progress);
            }
          }
        }
      );

      // Return the uploaded file details from response
      return {
        success: true,
        fileId: response.data.id,
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
        size: response.data.size,
        name: response.data.name,
        mimeType: response.data.mimeType,
        thumbnailLink: response.data.thumbnailLink
      };
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.response?.data?.error?.message || error.message || 'Upload failed');
    }
  }

  /**
   * Read file as base64
   */
  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get folder ID by name (creates if doesn't exist)
   * @param folderName - Name of the folder
   * @param parentFolderId - Optional parent folder ID to create under
   */
  async getOrCreateFolder(folderName: string, parentFolderId?: string): Promise<string> {
    try {
      const accessToken = localStorage.getItem('google_access_token');
      
      if (!accessToken) {
        throw new Error('No Google access token found. Please sign in first.');
      }

      // Build query to search for folder
      let query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
      
      // If parent folder is specified, search within that folder
      if (parentFolderId) {
        query += ` and '${parentFolderId}' in parents`;
      }
      
      // Search for existing folder
      const searchResponse = await googleDriveAxios.get(
        'https://www.googleapis.com/drive/v3/files',
        {
          params: {
            q: query,
            fields: 'files(id,name)',
            pageSize: 1
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      // If folder exists, return its ID
      if (searchResponse.data.files && searchResponse.data.files.length > 0) {
        console.log(`Found existing folder "${folderName}"`);
        return searchResponse.data.files[0].id;
      }

      // Create new folder
      const folderData: any = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      };
      
      // Add parent folder if specified
      if (parentFolderId) {
        folderData.parents = [parentFolderId];
      }

      console.log(`Creating new folder "${folderName}"`);
      const createResponse = await googleDriveAxios.post(
        'https://www.googleapis.com/drive/v3/files',
        folderData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`Created folder "${folderName}" with ID:`, createResponse.data.id);
      return createResponse.data.id;
    } catch (error: any) {
      console.error('Error creating folder:', error);
      throw new Error(`Failed to create folder: ${folderName}`);
    }
  }

  /**
   * Get or create the "elimurise" folder
   */
  async getOrCreateElimuriseFolder(): Promise<string> {
    try {
      const accessToken = localStorage.getItem('google_access_token');
      
      if (!accessToken) {
        throw new Error('No Google access token found. Please sign in first.');
      }
      
      // Search for existing "elimurise" folder
      const searchResponse = await googleDriveAxios.get(
        'https://www.googleapis.com/drive/v3/files',
        {
          params: {
            q: `name='elimurise' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id,name)',
            pageSize: 1
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      // If folder exists, return its ID
      if (searchResponse.data.files && searchResponse.data.files.length > 0) {
        console.log('Found existing "elimurise" folder');
        return searchResponse.data.files[0].id;
      }

      // Create new "elimurise" folder
      console.log('Creating new "elimurise" folder');
      const createResponse = await googleDriveAxios.post(
        'https://www.googleapis.com/drive/v3/files',
        {
          name: 'elimurise',
          mimeType: 'application/vnd.google-apps.folder'
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Created "elimurise" folder with ID:', createResponse.data.id);
      return createResponse.data.id;
    } catch (error: any) {
      console.error('Error creating "elimurise" folder:', error);
      throw new Error('Failed to create "elimurise" folder');
    }
  }

  /**
   * List folders in Google Drive
   */
  async listFolders(): Promise<any[]> {
    try {
      const accessToken = localStorage.getItem('google_access_token');
     

      const response = await axios.get(
        'https://www.googleapis.com/drive/v3/files',
        {
          params: {
            q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
            fields: 'files(id,name,parents,createdTime)',
            orderBy: 'name',
            pageSize: 100
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data.files || [];
    } catch (error: any) {
      console.error('Error listing folders:', error);
      throw new Error(error.response?.data?.error?.message || 'Failed to list folders');
    }
  }

  /**
   * Sign out from Google Drive
   */
  signOut(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    localStorage.removeItem('google_oauth_code');
    localStorage.removeItem('google_oauth_state');
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    const token = localStorage.getItem('google_access_token');
    if (token) {
      // Load token into instance
      this.accessToken = token;
    }
    return !!token;
  }

  /**
   * Generate random state for OAuth flow
   */
  private generateRandomState(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

}

// Create singleton instance
const googleImageUploadService = new GoogleImageUploadService();

export default googleImageUploadService;