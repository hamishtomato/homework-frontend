import { useState } from 'react';
import { fileApi } from '@/entities/file';

/**
 * File edit feature hook
 */
export function useFileEdit(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFilename = async (id: number, newFilename: string) => {
    if (!newFilename.trim()) {
      setError('Filename cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await fileApi.update(id, { filename: newFilename });
      onSuccess?.();
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Failed to update file');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateFilename, loading, error };
}

