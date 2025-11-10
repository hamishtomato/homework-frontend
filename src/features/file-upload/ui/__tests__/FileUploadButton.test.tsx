import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUploadButton } from '../FileUploadButton'
import { fileApi } from '@/entities/file'

// Mock the file API
vi.mock('@/entities/file', () => ({
  fileApi: {
    upload: vi.fn(),
  },
}))

describe('FileUploadButton', () => {
  const mockOnUploadSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render file input', () => {
    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/choose files/i)
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('multiple')
  })

  it('should show "未選擇任何檔案" message by default', () => {
    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    expect(screen.getByText('未選擇任何檔案')).toBeInTheDocument()
  })

  it('should hide "未選擇任何檔案" message after selecting files', async () => {
    const user = userEvent.setup()
    vi.mocked(fileApi.upload).mockResolvedValue({ id: 1 })

    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    expect(screen.getByText('未選擇任何檔案')).toBeInTheDocument()

    const fileInput = screen.getByLabelText(/choose files/i)
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.queryByText('未選擇任何檔案')).not.toBeInTheDocument()
    })
  })

  it('should display upload progress for selected file', async () => {
    const user = userEvent.setup()
    let progressCallback: ((progress: number) => void) | undefined

    vi.mocked(fileApi.upload).mockImplementation(async (_file, onProgress) => {
      progressCallback = onProgress
      return { id: 1 }
    })

    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/choose files/i)
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument()
    })

    // Simulate progress updates
    if (progressCallback) {
      progressCallback(50)
      await waitFor(() => {
        expect(screen.getByText('50%')).toBeInTheDocument()
      })
    }
  })

  it('should show success message when upload completes', async () => {
    const user = userEvent.setup()

    vi.mocked(fileApi.upload).mockImplementation(async (_file, onProgress) => {
      onProgress?.(100)
      return { id: 1 }
    })

    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/choose files/i)
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByText('Upload complete')).toBeInTheDocument()
    })

    expect(mockOnUploadSuccess).toHaveBeenCalled()
  })

  it('should show error message when upload fails', async () => {
    const user = userEvent.setup()

    vi.mocked(fileApi.upload).mockRejectedValue(new Error('Upload failed'))

    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/choose files/i)
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument()
    })
  })

  it('should show close button only for completed uploads', async () => {
    const user = userEvent.setup()

    vi.mocked(fileApi.upload).mockImplementation(async (_file, onProgress) => {
      onProgress?.(100)
      return { id: 1 }
    })

    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/choose files/i)
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByText('Upload complete')).toBeInTheDocument()
    })

    // Close button should be visible for completed upload
    const closeButton = screen.getByLabelText(/remove test\.jpg/i)
    expect(closeButton).toBeInTheDocument()
  })

  it('should remove upload when close button is clicked', async () => {
    const user = userEvent.setup()

    vi.mocked(fileApi.upload).mockImplementation(async (_file, onProgress) => {
      onProgress?.(100)
      return { id: 1 }
    })

    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/choose files/i)
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument()
    })

    const closeButton = screen.getByLabelText(/remove test\.jpg/i)
    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText('test.jpg')).not.toBeInTheDocument()
    })
  })

  it('should show "未選擇任何檔案" again after removing last upload', async () => {
    const user = userEvent.setup()

    vi.mocked(fileApi.upload).mockImplementation(async (_file, onProgress) => {
      onProgress?.(100)
      return { id: 1 }
    })

    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/choose files/i)
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.queryByText('未選擇任何檔案')).not.toBeInTheDocument()
    })

    const closeButton = screen.getByLabelText(/remove test\.jpg/i)
    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.getByText('未選擇任何檔案')).toBeInTheDocument()
    })
  })

  it('should handle multiple file uploads', async () => {
    const user = userEvent.setup()

    vi.mocked(fileApi.upload).mockImplementation(async (_file, onProgress) => {
      onProgress?.(100)
      return { id: 1 }
    })

    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/choose files/i)
    const file1 = new File(['content 1'], 'test1.jpg', { type: 'image/jpeg' })
    const file2 = new File(['content 2'], 'test2.jpg', { type: 'image/jpeg' })

    await user.upload(fileInput, [file1, file2])

    await waitFor(() => {
      expect(screen.getByText('test1.jpg')).toBeInTheDocument()
      expect(screen.getByText('test2.jpg')).toBeInTheDocument()
    })

    expect(fileApi.upload).toHaveBeenCalledTimes(2)
  })

  it('should not show close button while upload is in progress', async () => {
    const user = userEvent.setup()

    vi.mocked(fileApi.upload).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/choose files/i)
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument()
    })

    // Close button should not be visible while uploading
    expect(screen.queryByLabelText(/remove test\.jpg/i)).not.toBeInTheDocument()
  })

  it('should show close button for failed uploads', async () => {
    const user = userEvent.setup()

    vi.mocked(fileApi.upload).mockRejectedValue(new Error('Upload failed'))

    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/choose files/i)
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument()
    })

    // Close button should be visible for failed upload
    const closeButton = screen.getByLabelText(/remove test\.jpg/i)
    expect(closeButton).toBeInTheDocument()
  })

  it('should show alert for files exceeding 50MB limit', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<FileUploadButton onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/choose files/i)
    // Create a file larger than 50MB (50 * 1024 * 1024 + 1 bytes)
    const largeFile = new File(['x'.repeat(52428801)], 'large.jpg', { type: 'image/jpeg' })

    await user.upload(fileInput, largeFile)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('large.jpg exceeds 50MB limit')
    })

    // Should not attempt upload
    expect(fileApi.upload).not.toHaveBeenCalled()

    alertSpy.mockRestore()
  })
})

