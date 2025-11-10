import { useRef, type ChangeEvent } from 'react';
import { useFileUpload } from '../model/useFileUpload';

interface FileUploadButtonProps {
  onUploadSuccess: () => void;
}

export function FileUploadButton({ onUploadSuccess }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploads, removeUpload } = useFileUpload(onUploadSuccess);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      await uploadFile(file);
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2">
          <span className="sr-only">Choose files</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              file:cursor-pointer"
          />
        </label>
      </div>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload, idx) => (
            <div key={idx} className="p-4 border rounded-lg bg-white">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium truncate flex-1 mr-2">
                  {upload.fileName}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{upload.progress}%</span>
                  {/* Show close button only for completed uploads */}
                  {(upload.status === 'success' || upload.status === 'error') && (
                    <button
                      onClick={() => removeUpload(upload.fileName)}
                      className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
                      title="Remove"
                      aria-label={`Remove ${upload.fileName}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    upload.status === 'success'
                      ? 'bg-green-500'
                      : upload.status === 'error'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
              {/* Status message */}
              {upload.status === 'success' && (
                <p className="text-xs text-green-600 mt-1">Upload complete</p>
              )}
              {upload.status === 'error' && (
                <p className="text-xs text-red-600 mt-1">Upload failed</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

