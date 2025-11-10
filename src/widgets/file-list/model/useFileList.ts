import { useState, useEffect, useCallback } from 'react';
import { fileApi, type FileMetadata } from '@/entities/file';

/**
 * File list widget hook
 */
export function useFileList() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const limit = 10;

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fileApi.list(page, limit, order);
      setFiles(response.files);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [page, order]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const refetch = () => {
    fetchFiles();
  };

  const toggleOrder = () => {
    setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return {
    files,
    loading,
    error,
    page,
    totalPages,
    order,
    setPage,
    toggleOrder,
    refetch,
  };
}

