/**
 * LocalStorage helper utilities
 */

const TOKEN_KEY = 'access_token';

export const storage = {
  /**
   * Get JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Set JWT token to localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Remove JWT token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

