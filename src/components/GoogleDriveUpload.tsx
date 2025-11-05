import React, { useState, useRef } from 'react';
import Button from '../base-components/Button';
import Card from '../base-components/Card';
import { googleDriveService } from '../utils/googleDriveService';
import { GoogleDriveFile, GoogleDriveFolder, UploadProgress } from '../utils/googleDriveConfig';
import GoogleDriveAuth from './GoogleDriveAuth';
import GoogleDriveFolderSelector from './GoogleDriveFolderSelector';
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Loader2,
  ExternalLink,
  Trash2
} from 'lucide-react';

interface GoogleDriveUploadProps {
  onUploadSuccess?: (file: GoogleDriveFile) => void;
  onUploadError?: (error: string) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
  multiple?: boolean;
  className?: string;
}

const GoogleDriveUpload: React.FC<GoogleDriveUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  acceptedFileTypes = ['*/*'],
  maxFileSize = 100, // 100MB default
  multiple = false,
  className = ''
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<GoogleDriveFolder | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: UploadProgress }>({});
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<GoogleDriveFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];

    files.forEach(file => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`File "${file.name}" is too large. Maximum size is ${maxFileSize}MB.`);
        return;
      }

      // Check file type
      if (acceptedFileTypes.includes('*/*') || 
          acceptedFileTypes.some(type => {
            if (type.endsWith('/*')) {
              return file.type.startsWith(type.slice(0, -1));
            }
            return file.type === type;
          })) {
        validFiles.push(file);
      } else {
        setError(`File "${file.name}" is not an accepted file type.`);
        return;
      }
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
      setError(null);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File): Promise<GoogleDriveFile> => {
    const fileId = `${file.name}-${file.size}`;
    setUploadingFiles(prev => new Set(prev).add(fileId));

    try {
      const uploadedFile = await googleDriveService.uploadFile(
        file,
        selectedFolder?.id,
        (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: progress
          }));
        }
      );

      setUploadedFiles(prev => [...prev, uploadedFile]);
      onUploadSuccess?.(uploadedFile);
      return uploadedFile;
    } catch (error: any) {
      onUploadError?.(error.message || 'Upload failed');
      throw error;
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    if (!googleDriveService.isUserSignedIn()) {
      setError('Please sign in to Google Drive first');
      return;
    }

    setError(null);

    try {
      if (multiple) {
        // Upload all files
        const uploadPromises = selectedFiles.map(file => uploadFile(file));
        await Promise.all(uploadPromises);
        setSelectedFiles([]);
      } else {
        // Upload single file
        const uploadedFile = await uploadFile(selectedFiles[0]);
        setSelectedFiles([]);
      }
    } catch (error: any) {
      setError(error.message || 'Upload failed');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('presentation')) return '📽️';
    return '📁';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Authentication */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Google Drive Upload</h2>
          <GoogleDriveAuth
            onAuthSuccess={() => setError(null)}
            onAuthError={(error) => setError(error)}
          />
        </div>
      </Card>

      {/* Folder Selection */}
      {googleDriveService.isUserSignedIn() && (
        <Card>
          <div className="p-6">
            <GoogleDriveFolderSelector
              onFolderSelect={setSelectedFolder}
              selectedFolder={selectedFolder}
            />
          </div>
        </Card>
      )}

      {/* File Selection */}
      {googleDriveService.isUserSignedIn() && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Select Files</h3>
            
            <div className="space-y-4">
              {/* File Input */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  Click to select files
                </p>
                <p className="text-sm text-gray-500">
                  Accepted types: {acceptedFileTypes.join(', ')}
                </p>
                <p className="text-sm text-gray-500">
                  Max size: {maxFileSize}MB per file
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept={acceptedFileTypes.join(',')}
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Files:</h4>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <File className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeFile(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Upload Progress:</h4>
                  {Object.entries(uploadProgress).map(([fileId, progress]) => (
                    <div key={fileId} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{fileId.split('-')[0]}</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {selectedFiles.length > 0 && (
                <Button
                  onClick={handleUpload}
                  disabled={uploadingFiles.size > 0}
                  className="w-full"
                >
                  {uploadingFiles.size > 0 ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload to Google Drive
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(file.mimeType)}</span>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {file.size && formatFileSize(parseInt(file.size))}
                      </p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex gap-2">
                    {file.webViewLink && (
                      <Button
                        onClick={() => window.open(file.webViewLink, '_blank')}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default GoogleDriveUpload;
