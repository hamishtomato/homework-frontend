import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUploadButton } from '@/features/file-upload';
import { FileListWidget } from '@/widgets/file-list';
import { storage } from '@/shared/lib/storage';

export function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    // Trigger file list refresh
    setRefreshKey((prev) => prev + 1);
  };

  const handleLogout = () => {
    storage.removeToken();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">File Management</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Upload section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
            <p className="text-sm text-gray-600 mb-4">
              Maximum file size: 50MB. Multiple files can be uploaded at once.
            </p>
            <FileUploadButton onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* File list section */}
          <div className="bg-white rounded-lg shadow p-6">
            <FileListWidget key={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
}

