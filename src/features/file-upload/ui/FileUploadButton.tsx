import { useRef, type ChangeEvent } from 'react';
import { useFileUpload } from '../model/useFileUpload';

interface FileUploadButtonProps {
  onUploadSuccess: () => void;
}

export function FileUploadButton({ onUploadSuccess }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploads } = useFileUpload(onUploadSuccess);

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
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium truncate flex-1 mr-2">
                  {upload.fileName}
                </span>
                <span className="text-sm text-gray-500">{upload.progress}%</span>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

