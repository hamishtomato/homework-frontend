import { useState, type FormEvent } from 'react';
import { useFileEdit } from '../model/useFileEdit';

interface EditFileModalProps {
  fileId: number;
  currentFilename: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditFileModal({
  fileId,
  currentFilename,
  onClose,
  onSuccess,
}: EditFileModalProps) {
  const [filename, setFilename] = useState(currentFilename);
  const { updateFilename, loading, error } = useFileEdit(() => {
    onSuccess();
    onClose();
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateFilename(fileId, filename);
    } catch {
      // Error is handled by useFileEdit hook
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Edit Filename
          </h3>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

