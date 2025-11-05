import { GOOGLE_DRIVE_CONFIG, GoogleDriveFile, GoogleDriveFolder, UploadProgress } from './googleDriveConfig';

declare global {
  interface Window {
    gapi: any;
  }
}

class GoogleDriveService {
  private isInitialized = false;
  private isSignedIn = false;
  private currentUser: any = null;

  constructor() {
    // Disabled auto-loading to prevent conflicts with new OAuth 2.0 implementation
    // this.loadGoogleAPI();
    console.warn('Old Google Drive Service is deprecated. Please use googleImageUploadService instead.');
  }

  private async loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        this.initializeGapi();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          this.initializeGapi();
          resolve();
        });
      };
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  private async initializeGapi(): Promise<void> {
    try {
      await window.gapi.client.init({
        apiKey: GOOGLE_DRIVE_CONFIG.API_KEY,
        clientId: GOOGLE_DRIVE_CONFIG.CLIENT_ID,
        discoveryDocs: [GOOGLE_DRIVE_CONFIG.DISCOVERY_DOC],
        scope: GOOGLE_DRIVE_CONFIG.SCOPES
      });

      this.isInitialized = true;
      console.log('Google Drive API initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Drive API:', error);
      throw error;
    }
  }

  async signIn(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.loadGoogleAPI();
    }

    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      
      this.isSignedIn = true;
      this.currentUser = user;
      console.log('User signed in successfully:', user.getBasicProfile().getName());
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      this.isSignedIn = false;
      this.currentUser = null;
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  isUserSignedIn(): boolean {
    return this.isSignedIn;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  async getFolders(): Promise<GoogleDriveFolder[]> {
    if (!this.isSignedIn) {
      throw new Error('User must be signed in to access folders');
    }

    try {
      const response = await window.gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'files(id, name, parents, mimeType)',
        orderBy: 'name'
      });

      return response.result.files || [];
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
  }

  async createFolder(folderName: string, parentId?: string): Promise<GoogleDriveFolder> {
    if (!this.isSignedIn) {
      throw new Error('User must be signed in to create folders');
    }

    try {
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        ...(parentId && { parents: [parentId] })
      };

      const response = await window.gapi.client.drive.files.create({
        resource: folderMetadata,
        fields: 'id, name, parents, mimeType'
      });

      return response.result;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  async uploadFile(
    file: File,
    folderId?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<GoogleDriveFile> {
    if (!this.isSignedIn) {
      throw new Error('User must be signed in to upload files');
    }

    try {
      const metadata = {
        name: file.name,
        ...(folderId && { parents: [folderId] })
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.lengthComputable ? event.total : file.size,
              percentage: Math.round((event.loaded / (event.lengthComputable ? event.total : file.size)) * 100)
            };
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,webContentLink,parents,createdTime,modifiedTime');
        xhr.setRequestHeader('Authorization', `Bearer ${this.getAccessToken()}`);
        xhr.send(form);
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  private getAccessToken(): string {
    if (!this.currentUser) {
      throw new Error('User not signed in');
    }
    return this.currentUser.getAuthResponse().access_token;
  }

  async getFile(fileId: string): Promise<GoogleDriveFile> {
    if (!this.isSignedIn) {
      throw new Error('User must be signed in to access files');
    }

    try {
      const response = await window.gapi.client.drive.files.get({
        fileId: fileId,
        fields: 'id,name,mimeType,size,webViewLink,webContentLink,parents,createdTime,modifiedTime'
      });

      return response.result;
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    if (!this.isSignedIn) {
      throw new Error('User must be signed in to delete files');
    }

    try {
      await window.gapi.client.drive.files.delete({
        fileId: fileId
      });
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const googleDriveService = new GoogleDriveService();
export default googleDriveService;
