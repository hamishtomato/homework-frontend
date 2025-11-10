/**
 * File entity types
 */

export interface FileMetadata {
  id: number;
  user_id: string;
  filename: string;
  url: string;
  size: number;
  content_type: string;
  created_at: string;
}

export interface FileListResponse {
  files: FileMetadata[];
  total: number;
  page: number;
  limit: number;
}

export interface FileUpdatePayload {
  filename: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

