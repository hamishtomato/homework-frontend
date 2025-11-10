import { useState } from 'react';
import { fileApi, type UploadProgress } from '@/entities/file';

/**
 * File upload feature hook
 */
export function useFileUpload(onSuccess?: () => void) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const uploadFile = async (file: File) => {
    // Check file size (50MB limit)
    if (file.size > 52428800) {
      alert(`${file.name} exceeds 50MB limit`);
      return;
    }

    const uploadItem: UploadProgress = {
      fileName: file.name,
      progress: 0,
      status: 'uploading',
    };

    setUploads((prev) => [...prev, uploadItem]);

    try {
      await fileApi.upload(file, (progress) => {
        setUploads((prev) =>
          prev.map((u) =>
            u.fileName === file.name ? { ...u, progress } : u
          )
        );
      });

      setUploads((prev) =>
        prev.map((u) =>
          u.fileName === file.name ? { ...u, status: 'success' } : u
        )
      );

      onSuccess?.();
    } catch {
      setUploads((prev) =>
        prev.map((u) =>
          u.fileName === file.name ? { ...u, status: 'error' } : u
        )
      );
    }
  };

  const clearUploads = () => setUploads([]);

  const removeUpload = (fileName: string) => {
    setUploads((prev) => prev.filter((u) => u.fileName !== fileName));
  };

  return { uploadFile, uploads, clearUploads, removeUpload };
}

