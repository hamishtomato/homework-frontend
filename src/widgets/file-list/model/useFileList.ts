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
  const [totalItems, setTotalItems] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [limit, setLimit] = useState(10);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fileApi.list(page, limit, order);
      setFiles(response.files);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [page, limit, order]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const refetch = () => {
    fetchFiles();
  };

  const toggleOrder = () => {
    setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPage(1); // Reset to first page when changing sort order
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing items per page
  };

  return {
    files,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    limit,
    order,
    setPage,
    setLimit: handleLimitChange,
    toggleOrder,
    refetch,
  };
}

