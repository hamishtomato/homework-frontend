import { useState } from 'react';
import { fileApi } from '@/entities/file';

/**
 * File delete feature hook
 */
export function useFileDelete(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFile = async (id: number, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await fileApi.delete(id);
      onSuccess?.();
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Failed to delete file');
    } finally {
      setLoading(false);
    }
  };

  return { deleteFile, loading, error };
}

