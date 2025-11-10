import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFileList } from '../useFileList';
import { fileApi } from '@/entities/file';

// Mock the file API
vi.mock('@/entities/file', () => ({
  fileApi: {
    list: vi.fn(),
  },
}));

describe('useFileList', () => {
  const mockFileListResponse = {
    files: [
      {
        id: 1,
        user_id: 'user-1',
        filename: 'test1.jpg',
        url: 'https://example.com/test1.jpg',
        size: 1024,
        content_type: 'image/jpeg',
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        user_id: 'user-1',
        filename: 'test2.pdf',
        url: 'https://example.com/test2.pdf',
        size: 2048,
        content_type: 'application/pdf',
        created_at: '2024-01-02T00:00:00Z',
      },
    ],
    total: 2,
    page: 1,
    limit: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fileApi.list).mockResolvedValue(mockFileListResponse);
  });

  it('should fetch files on mount with default sort (newest first)', async () => {
    const { result } = renderHook(() => useFileList());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fileApi.list).toHaveBeenCalledWith(1, 10, 'desc', 'created_at');
    expect(result.current.files).toEqual(mockFileListResponse.files);
    expect(result.current.totalItems).toBe(2);
  });

  it('should convert "newest" sort option to correct API parameters', async () => {
    const { result } = renderHook(() => useFileList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fileApi.list).toHaveBeenCalledWith(1, 10, 'desc', 'created_at');
  });

  it('should convert "oldest" sort option to correct API parameters', async () => {
    const { result } = renderHook(() => useFileList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Change sort to oldest
    result.current.setSortBy('oldest');

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledWith(1, 10, 'asc', 'created_at');
    });
  });

  it('should convert "largest" sort option to correct API parameters', async () => {
    const { result } = renderHook(() => useFileList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Change sort to largest
    result.current.setSortBy('largest');

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledWith(1, 10, 'desc', 'size');
    });
  });

  it('should convert "smallest" sort option to correct API parameters', async () => {
    const { result } = renderHook(() => useFileList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Change sort to smallest
    result.current.setSortBy('smallest');

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledWith(1, 10, 'asc', 'size');
    });
  });

  it('should reset to page 1 when sort changes', async () => {
    const { result } = renderHook(() => useFileList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Go to page 2
    result.current.setPage(2);

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledWith(2, 10, 'desc', 'created_at');
    });

    // Change sort - should reset to page 1
    result.current.setSortBy('largest');

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledWith(1, 10, 'desc', 'size');
    });

    expect(result.current.page).toBe(1);
  });

  it('should reset to page 1 when limit changes', async () => {
    const { result } = renderHook(() => useFileList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Go to page 2
    result.current.setPage(2);

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledWith(2, 10, 'desc', 'created_at');
    });

    // Change limit - should reset to page 1
    result.current.setLimit(20);

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledWith(1, 20, 'desc', 'created_at');
    });

    expect(result.current.page).toBe(1);
  });

  it('should handle API error', async () => {
    vi.mocked(fileApi.list).mockRejectedValue(
      new Error('Failed to load files')
    );

    const { result } = renderHook(() => useFileList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load files');
    expect(result.current.files).toEqual([]);
  });

  it('should handle API error with response detail', async () => {
    const errorWithResponse = {
      response: {
        data: {
          detail: 'Unauthorized access',
        },
      },
    };

    vi.mocked(fileApi.list).mockRejectedValue(errorWithResponse);

    const { result } = renderHook(() => useFileList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Unauthorized access');
  });

  it('should refetch files when refetch is called', async () => {
    const { result } = renderHook(() => useFileList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fileApi.list).toHaveBeenCalledTimes(1);

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledTimes(2);
    });
  });

  it('should calculate total pages correctly', async () => {
    vi.mocked(fileApi.list).mockResolvedValue({
      ...mockFileListResponse,
      total: 25,
    });

    const { result } = renderHook(() => useFileList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.totalPages).toBe(3); // ceil(25 / 10) = 3
  });

  it('should update sortBy state when setSortBy is called', async () => {
    const { result } = renderHook(() => useFileList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.sortBy).toBe('newest');

    result.current.setSortBy('largest');

    await waitFor(() => {
      expect(result.current.sortBy).toBe('largest');
    });
  });
});

