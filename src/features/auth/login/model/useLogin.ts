import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/entities/user';
import { storage } from '@/shared/lib/storage';

/**
 * Login feature hook
 */
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { access_token } = await userApi.login({ email, password });
      storage.setToken(access_token);
      navigate('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

