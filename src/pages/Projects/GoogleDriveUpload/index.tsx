import React from 'react';
import ImageDriveUpload from '../../../components/ImageDriveUpload';

const GoogleDriveUploadPage: React.FC = () => {
  const handleUploadSuccess = (file: any) => {
    console.log('Image uploaded successfully:', file);
    // You can add additional logic here, like showing a success notification
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // You can add additional error handling here, like showing an error notification
  };

  const handleImageSelect = (url: string) => {
    console.log('Image selected:', url);
    // Handle the selected image URL
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Google Drive Image Upload
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload images to Google Drive with OAuth 2.0 authentication
          </p>
        </div>

        <ImageDriveUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          onImageSelect={handleImageSelect}
          maxFileSize={10} // 10MB for images
        />
      </div>
    </div>
  );
};

export default GoogleDriveUploadPage;
