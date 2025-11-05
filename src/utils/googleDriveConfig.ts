// Google Drive API Configuration
export const GOOGLE_DRIVE_CONFIG = {
  // These should be moved to environment variables in production
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1056323070211-jc21517cqebttjhp98sc664ujb83k9bq.apps.googleusercontent.com',
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyBRm08YrjnFXu3bCMn8EOubmpKMYFTr89I',
  DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  SCOPES: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata.readonly'
  ].join(' '),
  UPLOAD_FOLDER_NAME: 'Portfolio Uploads' // Default folder name
};

// Check if Google Drive is properly configured
export const isGoogleDriveConfigured = (): boolean => {
  return !!(GOOGLE_DRIVE_CONFIG.CLIENT_ID && 
           GOOGLE_DRIVE_CONFIG.API_KEY && 
           GOOGLE_DRIVE_CONFIG.CLIENT_ID !== '1056323070211-jc21517cqebttjhp98sc664ujb83k9bq.apps.googleusercontent.com' &&
           GOOGLE_DRIVE_CONFIG.API_KEY !== 'AIzaSyBRm08YrjnFXu3bCMn8EOubmpKMYFTr89I');
};

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
  parents?: string[];
  createdTime: string;
  modifiedTime: string;
}

export interface GoogleDriveFolder {
  id: string;
  name: string;
  parents?: string[];
  mimeType: 'application/vnd.google-apps.folder';
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
