import { useFileList } from '../model/useFileList';
import { FileCard } from './FileCard';
import { Pagination } from '@/shared/ui/Pagination';

export function FileListWidget() {
  const { files, loading, error, page, totalPages, totalItems, limit, order, setPage, setLimit, toggleOrder, refetch } =
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

  return (
    <div className="space-y-6">
      {/* Sort controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Files ({totalItems})</h2>
        <button
          onClick={toggleOrder}
          className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Sort: {order === 'desc' ? 'Newest First' : 'Oldest First'}
        </button>
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

