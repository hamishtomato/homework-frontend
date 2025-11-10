import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/entities/user';
import { storage } from '@/shared/lib/storage';

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
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}

