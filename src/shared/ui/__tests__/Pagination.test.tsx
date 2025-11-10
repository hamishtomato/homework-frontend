import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    onPageChange: vi.fn(),
  }

  it('should render pagination with correct item range', () => {
    render(<Pagination {...defaultProps} />)
    
    expect(screen.getByText(/Showing 1 to 10 of 100 items/i)).toBeInTheDocument()
  })

  it('should display correct item range for middle page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />)
    
    expect(screen.getByText(/Showing 41 to 50 of 100 items/i)).toBeInTheDocument()
  })

  it('should display correct item range for last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} totalItems={95} />)
    
    expect(screen.getByText(/Showing 91 to 95 of 95 items/i)).toBeInTheDocument()
  })

  it('should show 0 to 0 when no items', () => {
    render(<Pagination {...defaultProps} totalItems={0} totalPages={0} />)
    
    expect(screen.getByText(/Showing 0 to 0 of 0 items/i)).toBeInTheDocument()
  })

  it('should render Previous and Next buttons', () => {
    render(<Pagination {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('should disable Previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    
    const previousButton = screen.getByRole('button', { name: /previous/i })
    expect(previousButton).toBeDisabled()
  })

  it('should disable Next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} />)
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeDisabled()
  })

  it('should call onPageChange when clicking Previous button', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    
    render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />)
    
    const previousButton = screen.getByRole('button', { name: /previous/i })
    await user.click(previousButton)
    
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('should call onPageChange when clicking Next button', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    
    render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />)
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)
    
    expect(onPageChange).toHaveBeenCalledWith(6)
  })

  it('should render First and Last page buttons on desktop', () => {
    render(<Pagination {...defaultProps} />)
    
    const firstPageButton = screen.getByTitle(/first page/i)
    const lastPageButton = screen.getByTitle(/last page/i)
    
    expect(firstPageButton).toBeInTheDocument()
    expect(lastPageButton).toBeInTheDocument()
  })

  it('should call onPageChange with 1 when clicking First page button', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    
    render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />)
    
    const firstPageButton = screen.getByTitle(/first page/i)
    await user.click(firstPageButton)
    
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('should call onPageChange with totalPages when clicking Last page button', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    
    render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />)
    
    const lastPageButton = screen.getByTitle(/last page/i)
    await user.click(lastPageButton)
    
    expect(onPageChange).toHaveBeenCalledWith(10)
  })

  it('should disable First page button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    
    const firstPageButton = screen.getByTitle(/first page/i)
    expect(firstPageButton).toBeDisabled()
  })

  it('should disable Last page button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} />)
    
    const lastPageButton = screen.getByTitle(/last page/i)
    expect(lastPageButton).toBeDisabled()
  })

  it('should render page numbers for small total pages', () => {
    render(<Pagination {...defaultProps} currentPage={3} totalPages={5} />)
    
    // When on page 3 of 5: Should show all pages: 1, 2, 3, 4, 5
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
    
    // Should not have ellipsis when all pages are shown
    expect(screen.queryByText('...')).not.toBeInTheDocument()
  })

  it('should render page numbers with ellipsis for large total pages', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={20} />)
    
    // Should show: 1 ... 3 4 5 6 7 ... 20
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()
    
    // Should have ellipsis
    const ellipsis = screen.getAllByText('...')
    expect(ellipsis.length).toBeGreaterThan(0)
  })

  it('should highlight current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} totalPages={5} />)
    
    const currentPageButton = screen.getByRole('button', { name: '3' })
    expect(currentPageButton).toHaveClass('bg-blue-600', 'text-white')
  })

  it('should call onPageChange when clicking a page number', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    
    render(<Pagination {...defaultProps} currentPage={1} totalPages={5} onPageChange={onPageChange} />)
    
    const page3Button = screen.getByRole('button', { name: '3' })
    await user.click(page3Button)
    
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('should render items per page selector when callback provided', () => {
    const onItemsPerPageChange = vi.fn()
    
    render(<Pagination {...defaultProps} onItemsPerPageChange={onItemsPerPageChange} />)
    
    expect(screen.getByLabelText(/per page/i)).toBeInTheDocument()
  })

  it('should not render items per page selector when callback not provided', () => {
    render(<Pagination {...defaultProps} />)
    
    expect(screen.queryByLabelText(/per page/i)).not.toBeInTheDocument()
  })

  it('should call onItemsPerPageChange when changing items per page', async () => {
    const onItemsPerPageChange = vi.fn()
    const user = userEvent.setup()
    
    render(<Pagination {...defaultProps} onItemsPerPageChange={onItemsPerPageChange} />)
    
    const select = screen.getByLabelText(/per page/i)
    await user.selectOptions(select, '20')
    
    expect(onItemsPerPageChange).toHaveBeenCalledWith(20)
  })

  it('should display custom items per page options', () => {
    const onItemsPerPageChange = vi.fn()
    
    render(
      <Pagination
        {...defaultProps}
        onItemsPerPageChange={onItemsPerPageChange}
        itemsPerPageOptions={[5, 15, 25]}
      />
    )
    
    const select = screen.getByLabelText(/per page/i) as HTMLSelectElement
    const options = Array.from(select.options).map(opt => opt.value)
    
    expect(options).toEqual(['5', '15', '25'])
  })

  it('should show current selected items per page', () => {
    const onItemsPerPageChange = vi.fn()
    
    render(
      <Pagination
        {...defaultProps}
        itemsPerPage={20}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    )
    
    const select = screen.getByLabelText(/per page/i) as HTMLSelectElement
    expect(select.value).toBe('20')
  })

  it('should not render navigation buttons when only one page', () => {
    render(<Pagination {...defaultProps} totalPages={1} />)
    
    // Navigation buttons should not be visible
    expect(screen.queryByTitle(/first page/i)).not.toBeInTheDocument()
    expect(screen.queryByTitle(/last page/i)).not.toBeInTheDocument()
  })

  it('should handle edge case with current page at beginning', () => {
    render(<Pagination {...defaultProps} currentPage={1} totalPages={20} />)
    
    // Should show: 1 2 3 ... 20
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()
  })

  it('should handle edge case with current page at end', () => {
    render(<Pagination {...defaultProps} currentPage={20} totalPages={20} />)
    
    // Should show: 1 ... 18 19 20
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '18' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '19' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()
  })

  it('should display current page indicator on mobile', () => {
    render(<Pagination {...defaultProps} currentPage={3} totalPages={10} />)
    
    // Mobile indicator format: "3 / 10"
    const mobileIndicator = screen.getByText(/3 \/ 10/)
    expect(mobileIndicator).toBeInTheDocument()
  })
})

