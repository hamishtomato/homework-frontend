import { useState, useEffect } from 'react';
import { apiClient } from '@/shared/api/client';

interface AuthenticatedImageProps {
  fileId: number;
  alt: string;
  className?: string;
}

/**
 * Image component that loads images through authenticated backend API
 * Converts the API response to a blob URL for display
 */
export function AuthenticatedImage({ fileId, alt, className }: AuthenticatedImageProps) {
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);

        // Fetch image through backend proxy with JWT token
        const response = await apiClient.get(`/files/${fileId}/download`, {
          responseType: 'blob',
        });

        // Create blob URL for the image
        objectUrl = URL.createObjectURL(response.data);
        setBlobUrl(objectUrl);
      } catch (err) {
        console.error('Failed to load authenticated image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    // Cleanup blob URL on unmount
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileId]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <span className="text-xs text-gray-400">...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    );
  }

  return <img src={blobUrl} alt={alt} className={className} />;
}

