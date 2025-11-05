import React, { useState, useEffect } from 'react';
import Button from '../base-components/Button';
import { googleDriveService } from '../utils/googleDriveService';
import { GoogleDriveFolder } from '../utils/googleDriveConfig';
import { Loader2, Folder, Plus, CheckCircle, AlertCircle } from 'lucide-react';

interface GoogleDriveFolderSelectorProps {
  onFolderSelect?: (folder: GoogleDriveFolder | null) => void;
  selectedFolder?: GoogleDriveFolder | null;
  className?: string;
}

const GoogleDriveFolderSelector: React.FC<GoogleDriveFolderSelectorProps> = ({
  onFolderSelect,
  selectedFolder,
  className = ''
}) => {
  const [folders, setFolders] = useState<GoogleDriveFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    if (!googleDriveService.isUserSignedIn()) {
      setError('Please sign in to Google Drive first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const foldersList = await googleDriveService.getFolders();
      setFolders(foldersList);
    } catch (err: any) {
      setError(err.message || 'Failed to load folders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderSelect = (folder: GoogleDriveFolder) => {
    onFolderSelect?.(folder);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setError('Please enter a folder name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newFolder = await googleDriveService.createFolder(newFolderName.trim());
      setFolders(prev => [...prev, newFolder].sort((a, b) => a.name.localeCompare(b.name)));
      setNewFolderName('');
      setShowCreateFolder(false);
      onFolderSelect?.(newFolder);
    } catch (err: any) {
      setError(err.message || 'Failed to create folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRootFolder = () => {
    onFolderSelect?.(null);
  };

  if (!googleDriveService.isUserSignedIn()) {
    return (
      <div className={`text-center text-gray-500 ${className}`}>
        <Folder className="h-8 w-8 mx-auto mb-2" />
        <p>Please sign in to Google Drive to select a folder</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select Upload Folder</h3>
        <Button
          onClick={() => setShowCreateFolder(!showCreateFolder)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Folder
        </Button>
      </div>

      {/* Create New Folder Form */}
      {showCreateFolder && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <Button
              onClick={handleCreateFolder}
              disabled={isLoading || !newFolderName.trim()}
              size="sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
            </Button>
            <Button
              onClick={() => {
                setShowCreateFolder(false);
                setNewFolderName('');
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Root Folder Option */}
      <div
        onClick={handleRootFolder}
        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
          selectedFolder === null
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <Folder className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <p className="font-medium">Root Folder (My Drive)</p>
            <p className="text-sm text-gray-500">Upload files directly to My Drive</p>
          </div>
          {selectedFolder === null && (
            <CheckCircle className="h-5 w-5 text-blue-500" />
          )}
        </div>
      </div>

      {/* Folders List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading folders...</span>
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <Folder className="h-8 w-8 mx-auto mb-2" />
            <p>No folders found</p>
            <p className="text-sm">Create a new folder to get started</p>
          </div>
        ) : (
          folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderSelect(folder)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedFolder?.id === folder.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="font-medium">{folder.name}</p>
                  <p className="text-sm text-gray-500">Folder</p>
                </div>
                {selectedFolder?.id === folder.id && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={loadFolders}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default GoogleDriveFolderSelector;
