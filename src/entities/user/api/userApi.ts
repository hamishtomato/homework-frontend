import { apiClient } from '@/shared/api/client';
import type { User, AuthResponse, AuthCredentials } from '../model/types';

/**
 * User API endpoints
 */
export const userApi = {
  /**
   * Register a new user
   */
  async signup(credentials: AuthCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/signup', credentials);
    return data;
  },

  /**
   * Login user
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  /**
   * Get current user info
   */
  async getMe(): Promise<User> {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },
};

