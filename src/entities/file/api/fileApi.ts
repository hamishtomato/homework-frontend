import { apiClient } from '@/shared/api/client';
import type { FileMetadata, FileListResponse, FileUpdatePayload } from '../model/types';

/**
 * File API endpoints
 */
export const fileApi = {
  /**
   * Upload a file with progress tracking
   */
  async upload(
    file: File,
    onUploadProgress: (progress: number) => void
  ): Promise<FileMetadata> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<FileMetadata>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        onUploadProgress(progress);
      },
    });

    return data;
  },

  /**
   * Get paginated list of files
   */
  async list(
    page: number = 1,
    limit: number = 10,
    order: 'asc' | 'desc' = 'desc',
    orderBy: string = 'created_at'
  ): Promise<FileListResponse> {
    const { data } = await apiClient.get<FileListResponse>('/files', {
      params: { page, limit, order, order_by: orderBy },
    });
    return data;
  },

  /**
   * Update file metadata
   */
  async update(id: number, payload: FileUpdatePayload): Promise<FileMetadata> {
    const { data } = await apiClient.put<FileMetadata>(`/files/${id}`, payload);
    return data;
  },

  /**
   * Delete a file
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/files/${id}`);
  },
};

