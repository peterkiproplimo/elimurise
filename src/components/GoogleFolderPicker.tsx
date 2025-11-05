import React, { useState, useEffect } from 'react';
import { Dialog } from '../base-components/Headless';
import Button from '../base-components/Button';
import Card from '../base-components/Card';
import googleImageUploadService from '../services/googleImageUploadService';
import { 
  Folder, 
  Search, 
  LayoutGrid, 
  List, 
  X, 
  Loader2,
  ArrowUpDown,
  CheckCircle,
  FolderOpen
} from 'lucide-react';
import Lucide from '../base-components/Lucide';

interface GoogleFolder {
  id: string;
  name: string;
  parents?: string[];
  createdTime?: string;
}

interface GoogleFolderPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (folder: { id: string; name: string }) => void;
  selectedFolder?: { id: string; name: string } | null;
}

const GoogleFolderPicker: React.FC<GoogleFolderPickerProps> = ({
  open,
  onClose,
  onSelect,
  selectedFolder
}) => {
  const [folders, setFolders] = useState<GoogleFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (open) {
      loadFolders();
    }
  }, [open]);

  const loadFolders = async () => {
    setLoading(true);
    setError(null);

    try {
      const foldersList = await googleImageUploadService.listFolders();
      setFolders(foldersList);
    } catch (err: any) {
      setError(err.message || 'Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFolders = [...filteredFolders].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const handleFolderClick = (folder: GoogleFolder) => {
    onSelect({ id: folder.id, name: folder.name });
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Panel className="max-w-4xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-3">
            <Folder className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pick a folder
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-600 px-6 bg-gray-50 dark:bg-gray-800/50">
          <button className="px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
            Folders
          </button>
          <button className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            Google Drive
          </button>
          <button className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            Shared drives
          </button>
          <button className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            Recent
          </button>
        </div>

        {/* Search and View Controls */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-600 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control pl-10"
            />
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {viewMode === 'grid' ? (
              <List className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <LayoutGrid className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-1"
          >
            <ArrowUpDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button onClick={loadFolders} variant="primary" className="mt-4">
                Try Again
              </Button>
            </div>
          ) : sortedFolders.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? 'No folders found matching your search' : 'No folders available'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sortedFolders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className={`relative p-4 border-2 rounded-lg transition-all text-left hover:shadow-md ${
                    selectedFolder?.id === folder.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <Folder className="h-12 w-12 text-blue-500" />
                      {selectedFolder?.id === folder.id && (
                        <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-blue-600 bg-white rounded-full" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-center line-clamp-2 text-gray-900 dark:text-white">
                      {folder.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedFolders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className={`w-full p-4 border-2 rounded-lg transition-all text-left hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedFolder?.id === folder.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Folder className="h-8 w-8 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {folder.name}
                      </p>
                      {folder.createdTime && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Created: {formatDate(folder.createdTime)}
                        </p>
                      )}
                    </div>
                    {selectedFolder?.id === folder.id && (
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
          <Button onClick={onClose} variant="outline-secondary">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              // This button is not needed since clicking a folder selects it directly
              onClose();
            }}
            variant="primary"
          >
            Close
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default GoogleFolderPicker;
