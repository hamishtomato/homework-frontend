import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/entities/user';
import { storage } from '@/shared/lib/storage';
import type { AxiosError } from 'axios';

/**
 * Register feature hook
 */
export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { access_token } = await userApi.signup({ email, password });
      storage.setToken(access_token);
      navigate('/dashboard');
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>;
      
      // Check for 422 status code (validation error, usually email format)
      if (error.response?.status === 422) {
        setError('Invalid email format. Please enter a valid email address.');
      } else {
        setError(error.response?.data?.detail || 'Registration failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}

