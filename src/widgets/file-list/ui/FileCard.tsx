import { useState } from 'react';
import type { FileMetadata } from '@/entities/file';
import { formatFileSize, formatDateTime } from '@/shared/lib/formatters';
import { EditFileModal } from '@/features/file-edit';
import { useFileDelete } from '@/features/file-delete';
import { AuthenticatedImage } from '@/shared/ui/AuthenticatedImage';

interface FileCardProps {
  file: FileMetadata;
  onUpdate: () => void;
}

export function FileCard({ file, onUpdate }: FileCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const { deleteFile, loading: deleting } = useFileDelete(onUpdate);
  const isImage = file.content_type.startsWith('image/');
  
  // Generate backend proxy URL for download
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const downloadUrl = `${API_URL}/files/${file.id}/download`;

  return (
    <>
      <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            {isImage ? (
              <AuthenticatedImage
                fileId={file.id}
                alt={file.filename}
                className="w-20 h-20 object-cover rounded"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {file.filename}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(file.size)} • {formatDateTime(file.created_at)}
            </p>
            <p className="text-xs text-gray-400 mt-1">{file.content_type}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={async () => {
                try {
                  // Download through backend proxy with JWT
                  const response = await fetch(downloadUrl, {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                  });
                  
                  if (!response.ok) throw new Error('Download failed');
                  
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = file.filename;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                } catch (error) {
                  console.error('Download failed:', error);
                  alert('Failed to download file');
                }
              }}
              className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              Download
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="text-xs px-3 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => deleteFile(file.id, file.filename)}
              disabled={deleting}
              className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditFileModal
          fileId={file.id}
          currentFilename={file.filename}
          onClose={() => setShowEditModal(false)}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
}

