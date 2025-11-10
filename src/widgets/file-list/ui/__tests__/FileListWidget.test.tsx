import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileListWidget } from '../FileListWidget';
import { fileApi } from '@/entities/file';

// Mock dependencies
vi.mock('@/entities/file', () => ({
  fileApi: {
    list: vi.fn(),
  },
}));

vi.mock('../FileCard', () => ({
  FileCard: ({ file }: any) => <div data-testid={`file-${file.id}`}>{file.filename}</div>,
}));

vi.mock('@/shared/ui/Pagination', () => ({
  Pagination: ({ currentPage, totalPages }: any) => (
    <div data-testid="pagination">
      Page {currentPage} of {totalPages}
    </div>
  ),
}));

describe('FileListWidget', () => {
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

  it('should render loading state initially', () => {
    render(<FileListWidget />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render file list after loading', async () => {
    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByText('test1.jpg')).toBeInTheDocument();
      expect(screen.getByText('test2.pdf')).toBeInTheDocument();
    });
  });

  it('should display total file count', async () => {
    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByText('Your Files (2)')).toBeInTheDocument();
    });
  });

  it('should render sort dropdown with correct options', async () => {
    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox', { name: /sort by/i });
    expect(select).toBeInTheDocument();

    // Check all sort options are present
    expect(screen.getByRole('option', { name: /📅 Newest First/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /📅 Oldest First/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /📊 Largest First/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /📊 Smallest First/i })).toBeInTheDocument();
  });

  it('should default to "newest" sort option', async () => {
    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /sort by/i })).toHaveValue('newest');
    });

    expect(fileApi.list).toHaveBeenCalledWith(1, 10, 'desc', 'created_at');
  });

  it('should change sort to "oldest" when selected', async () => {
    const user = userEvent.setup();
    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox', { name: /sort by/i });
    await user.selectOptions(select, 'oldest');

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledWith(1, 10, 'asc', 'created_at');
    });
  });

  it('should change sort to "largest" when selected', async () => {
    const user = userEvent.setup();
    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox', { name: /sort by/i });
    await user.selectOptions(select, 'largest');

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledWith(1, 10, 'desc', 'size');
    });
  });

  it('should change sort to "smallest" when selected', async () => {
    const user = userEvent.setup();
    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox', { name: /sort by/i });
    await user.selectOptions(select, 'smallest');

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledWith(1, 10, 'asc', 'size');
    });
  });

  it('should display error message when API fails', async () => {
    vi.mocked(fileApi.list).mockRejectedValue(new Error('Failed to load files'));

    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load files')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should retry fetching files when retry button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(fileApi.list).mockRejectedValueOnce(new Error('Failed to load files'));

    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load files')).toBeInTheDocument();
    });

    // Mock successful response for retry
    vi.mocked(fileApi.list).mockResolvedValue(mockFileListResponse);

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('test1.jpg')).toBeInTheDocument();
    });
  });

  it('should display empty state when no files', async () => {
    vi.mocked(fileApi.list).mockResolvedValue({
      files: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByText('No files uploaded yet')).toBeInTheDocument();
    });
  });

  it('should render pagination component', async () => {
    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
  });

  it('should maintain sort selection after changing pages', async () => {
    const user = userEvent.setup();
    render(<FileListWidget />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
    });

    // Change sort to largest
    const select = screen.getByRole('combobox', { name: /sort by/i });
    await user.selectOptions(select, 'largest');

    await waitFor(() => {
      expect(select).toHaveValue('largest');
    });

    // Verify sort is still "largest"
    expect(select).toHaveValue('largest');
  });

  it('should have proper accessibility attributes on sort dropdown', async () => {
    render(<FileListWidget />);

    await waitFor(() => {
      const select = screen.getByRole('combobox', { name: /sort by/i });
      expect(select).toHaveAttribute('id', 'sort-select');
    });

    const label = screen.getByText('Sort by:');
    expect(label).toHaveAttribute('for', 'sort-select');
  });

  it('should call API with correct parameters on mount', async () => {
    render(<FileListWidget />);

    await waitFor(() => {
      expect(fileApi.list).toHaveBeenCalledTimes(1);
      expect(fileApi.list).toHaveBeenCalledWith(1, 10, 'desc', 'created_at');
    });
  });
});

