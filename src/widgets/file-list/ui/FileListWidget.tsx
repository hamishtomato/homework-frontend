import { useFileList, type SortOption } from '../model/useFileList';
import { FileCard } from './FileCard';
import { Pagination } from '@/shared/ui/Pagination';

export function FileListWidget() {
  const { files, loading, error, page, totalPages, totalItems, limit, sortBy, setPage, setLimit, setSortBy, refetch } =
    useFileList();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No files uploaded yet</p>
      </div>
    );
  }

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: '📅 Newest First' },
    { value: 'oldest', label: '📅 Oldest First' },
    { value: 'largest', label: '📊 Largest First' },
    { value: 'smallest', label: '📊 Smallest First' },
  ];

  return (
    <div className="space-y-6">
      {/* Sort controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Files ({totalItems})</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-gray-600">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* File list */}
      <div className="space-y-4">
        {files.map((file) => (
          <FileCard key={file.id} file={file} onUpdate={refetch} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={limit}
        onPageChange={setPage}
        onItemsPerPageChange={setLimit}
      />
    </div>
  );
}

