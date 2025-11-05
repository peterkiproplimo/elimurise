import React, { useState, useRef, useEffect } from 'react';
import Button from '../base-components/Button';
import Card from '../base-components/Card';
import googleImageUploadService from '../services/googleImageUploadService';
import { 
  Upload, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Loader2,
  ExternalLink,
  Download,
  LogIn
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  webViewLink: string;
  webContentLink: string;
  size: number;
  mimeType: string;
  thumbnailLink?: string;
}

interface ImageDriveUploadProps {
  onUploadSuccess?: (file: UploadedFile) => void;
  onUploadError?: (error: string) => void;
  onImageSelect?: (imageUrl: string) => void;
  maxFileSize?: number; // in MB
  className?: string;
}

const ImageDriveUpload: React.FC<ImageDriveUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  onImageSelect,
  maxFileSize = 10, // 10MB default for images
  className = ''
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [pendingUpload, setPendingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if there's an OAuth code in localStorage that needs to be exchanged
    const oauthCode = localStorage.getItem('google_oauth_code');
    
    if (oauthCode) {
      console.log('Found OAuth code in localStorage, exchanging for tokens...');
      handleOAuthCodeExchange(oauthCode);
    }
    
    // Check sign-in status immediately and after a delay
    const checkSignIn = () => {
      const signedIn = googleImageUploadService.isSignedIn();
      console.log('Checking sign-in status:', signedIn);
      setIsSignedIn(signedIn);
      
      // If user just signed in and we have pending files to upload, trigger upload
      if (signedIn && pendingUpload && selectedFiles.length > 0) {
        console.log('User signed in with pending files, starting upload...');
        setPendingUpload(false);
        // Trigger upload after a short delay
        setTimeout(() => {
          handleUploadAfterAuth();
        }, 500);
      }
      
      // Debug: log tokens if signed in
      if (signedIn) {
        const accessToken = localStorage.getItem('google_access_token');
        const refreshToken = localStorage.getItem('google_refresh_token');
        console.log('Tokens available:', {
          accessToken: accessToken ? 'EXISTS' : 'MISSING',
          refreshToken: refreshToken ? 'EXISTS' : 'MISSING'
        });
      }
    };
    
    // Check immediately
    checkSignIn();
    
    // Also check after a delay to catch post-redirect state
    const timer = setTimeout(checkSignIn, 500);
    
    return () => clearTimeout(timer);
  }, [pendingUpload, selectedFiles.length]);

  const handleOAuthCodeExchange = async (code: string) => {
    try {
      console.log('Exchanging code for tokens via backend...');
      
      const response = await fetch('http://localhost:5001/auth/google/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      console.log('Token exchange response:', data);
      
      if (data.success) {
        // Store refresh token (backend handles access tokens)
        if (data.refresh_token) {
          localStorage.setItem('google_refresh_token', data.refresh_token);
          localStorage.setItem('google_access_token', data.access_token);
        }
        
        // Clear the code from localStorage
        localStorage.removeItem('google_oauth_code');
        localStorage.removeItem('google_oauth_state');
        
        console.log('Tokens stored successfully');
      } else {
        throw new Error(data.error || 'Token exchange failed');
      }
    } catch (error: any) {
      console.error('Failed to exchange OAuth code:', error);
    }
  };

  // Handle sign in
  const handleSignIn = () => {
    console.log('Initiating sign-in...');
    console.log('Current isSignedIn state:', isSignedIn);
    console.log('Tokens in localStorage:', {
      accessToken: !!localStorage.getItem('google_access_token'),
      refreshToken: !!localStorage.getItem('google_refresh_token')
    });
    
    const authUrl = googleImageUploadService.generateAuthUrl();
    console.log('Auth URL:', authUrl);
    
    // Clear any invalid tokens
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    
    window.location.href = authUrl;
  };

  const handleSignOut = () => {
    googleImageUploadService.signOut();
    setIsSignedIn(false);
    setUploadedFiles([]);
  };

  const handleTestBackend = async () => {
    try {
      const code = localStorage.getItem('codeId');
      const state = localStorage.getItem('stateId');
      
      console.log('Testing token exchange with:', { code, state });
      
      if (!code) {
        setError('No code found in localStorage. Please sign in first.');
        return;
      }

      // Exchange code for tokens directly on the frontend
      const params = new URLSearchParams({
        code: code,
        client_id: '1056323070211-jc21517cqebttjhp98sc664ujb83k9bq.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:5173/home/oauthclientredirect',
        grant_type: 'authorization_code',
      });

      console.log('Sending token exchange request to Google...');

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      const data = await response.json();
      console.log('Token exchange response:', data);
      
      if (data.access_token) {
        localStorage.setItem('google_access_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('google_refresh_token', data.refresh_token);
        }
        setIsSignedIn(true);
        setError(null);
        console.log('Access token received and stored successfully');
      } else {
        setError(data.error_description || data.error || 'Failed to get access token');
      }
    } catch (error: any) {
      console.error('Token exchange error:', error);
      setError(error.message || 'Failed to exchange token');
    }
  };

  const debugTokens = () => {
    const accessToken = localStorage.getItem('google_access_token');
    const refreshToken = localStorage.getItem('google_refresh_token');
    console.log('=== DEBUG TOKENS ===');
    console.log('Access Token:', accessToken ? 'EXISTS' : 'MISSING', accessToken?.substring(0, 20) + '...');
    console.log('Refresh Token:', refreshToken ? 'EXISTS' : 'MISSING', refreshToken?.substring(0, 20) + '...');
    console.log('==================');
  };

  // To handle selection of multiple files and push them to an array
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];

    files.forEach(file => {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        setError(`File "${file.name}" is not an image.`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`Image "${file.name}" is too large. Maximum size is ${maxFileSize}MB.`);
        return;
      }

      validFiles.push(file);

      // Create preview for first image
      if (validFiles.length === 1) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setError(null);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  //  Remove files from the array
  const removeFile = (index: number) => {
    const file = selectedFiles[index];
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Clear preview if it was the previewed file
    if (previewUrl && selectedFiles[0] === file) {
      setPreviewUrl(null);
    }
  };

  const uploadToGoogleDrive = async (file: File): Promise<UploadedFile> => {
    try {
      const progressCallback = (progress: number) => {
        setUploadProgress(progress);
      };

      const result = await googleImageUploadService.uploadImage(file, undefined, progressCallback);
      
      return {
        id: result.fileId,
        name: result.name,
        webViewLink: result.webViewLink,
        webContentLink: result.webContentLink,
        size: result.size,
        mimeType: result.mimeType,
        thumbnailLink: result.thumbnailLink
      };
    } catch (error: any) {
      throw new Error(error.message || 'Upload failed');
    }
  };


  //  This is called when the user clicks the upload button
  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      setError('Please select images to upload');
      return;
    }

    console.log('=== UPLOAD BUTTON CLICKED ===');
    console.log('isSignedIn state:', isSignedIn);
    
    // Check if user is signed in
    if (!isSignedIn) {
      setError('Please sign in with Google first');
      return;
    }

    // User is signed in, proceed with upload
    console.log('User is signed in, proceeding with upload...');
    performUpload();
  };

  const handleUploadAfterAuth = async () => {
    console.log('Uploading after authentication...');
    performUpload();
  };

  const performUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('Starting upload of', selectedFiles.length, 'files');
      const uploadPromises = selectedFiles.map(file => uploadToGoogleDrive(file));
      const results = await Promise.all(uploadPromises);
      
      setUploadedFiles(prev => [...prev, ...results]);
      setSelectedFiles([]);
      setPreviewUrl(null);
      setUploadProgress(0);
      
      // Call success callbacks
      results.forEach(file => onUploadSuccess?.(file));
      
    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed';
      console.error('Upload error:', error);
      
      // If it's an authentication error, trigger sign-in
      if (errorMessage.includes('Not authenticated') || errorMessage.includes('sign in')) {
        setError('Please sign in with Google to continue');
        setPendingUpload(true);
        // handleSignIn();
      } else {
        setError(errorMessage);
        onUploadError?.(errorMessage);
      }
    } finally {
      setUploading(false);
      setPendingUpload(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageClick = (file: UploadedFile) => {
    setPreviewUrl(file.webViewLink);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sign In Card */}
      {!isSignedIn && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Google Drive Authentication</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Sign in to Google Drive to upload images
            </p>
            <Button onClick={handleSignIn} className="w-full" variant="primary">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In to Google Drive
            </Button>
          </div>
        </Card>
      )}

      
      <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Test Backend Token Generation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Send state and code to backend to get access token
            </p>
            <Button onClick={handleTestBackend} className="w-full" variant="primary">
              <LogIn className="h-4 w-4 mr-2" />
              Test Backend Token Generation
            </Button>
          </div>
        </Card>


      {/* File Selection Card */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Upload Images to Google Drive
          </h3>
          
          <div className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                Click to select images
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                JPEG, PNG, GIF, WebP
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Max size: {maxFileSize}MB per image
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Preview */}
            {previewUrl && (
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-64 object-contain"
                />
                <Button
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFiles([]);
                  }}
                  variant="outline-secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected Images:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                        <Button
                          onClick={() => removeFile(index)}
                          variant="outline-secondary"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            {selectedFiles.length > 0 && (
              <>
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload to Google Drive Test 13324
                    </>
                  )}
                </Button>
                
                {uploading && uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Uploaded Files */}
      {isSignedIn && uploadedFiles.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Uploaded Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={file.thumbnailLink || file.webViewLink}
                      alt={file.name}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => {
                        handleImageClick(file);
                        onImageSelect?.(file.webViewLink);
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {file.webViewLink && (
                        <Button
                          onClick={() => window.open(file.webViewLink, '_blank')}
                          variant="outline-secondary"
                          size="sm"
                          className="flex-1"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          <span className="text-xs">View</span>
                        </Button>
                      )}
                      {file.webContentLink && (
                        <Button
                          onClick={() => window.open(file.webContentLink, '_blank')}
                          variant="outline-secondary"
                          size="sm"
                          className="flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          <span className="text-xs">Download</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageDriveUpload;
