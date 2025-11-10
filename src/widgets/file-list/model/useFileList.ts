import { useState, useEffect, useCallback } from 'react';
import { fileApi, type FileMetadata } from '@/entities/file';

export type SortOption = 'newest' | 'oldest' | 'largest' | 'smallest';

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
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [limit, setLimit] = useState(10);

  // Convert sort option to API parameters
  const getSortParams = (sort: SortOption) => {
    switch (sort) {
      case 'newest':
        return { orderBy: 'created_at', order: 'desc' as const };
      case 'oldest':
        return { orderBy: 'created_at', order: 'asc' as const };
      case 'largest':
        return { orderBy: 'size', order: 'desc' as const };
      case 'smallest':
        return { orderBy: 'size', order: 'asc' as const };
    }
  };

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { orderBy, order } = getSortParams(sortBy);
      const response = await fileApi.list(page, limit, order, orderBy);
      setFiles(response.files);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const refetch = () => {
    fetchFiles();
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setPage(1); // Reset to first page when changing sort
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
    sortBy,
    setPage,
    setLimit: handleLimitChange,
    setSortBy: handleSortChange,
    refetch,
  };
}

