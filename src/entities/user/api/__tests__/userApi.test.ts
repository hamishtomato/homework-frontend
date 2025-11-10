import { describe, it, expect, beforeEach } from 'vitest'
import { userApi } from '../userApi'
import { storage } from '@/shared/lib/storage'

describe('userApi', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const result = await userApi.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
      })
    })

    it('should throw error with incorrect credentials', async () => {
      await expect(
        userApi.login({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow()
    })
  })

  describe('signup', () => {
    it('should signup successfully with new email', async () => {
      const result = await userApi.signup({
        email: 'newuser@example.com',
        password: 'password123',
      })

      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
      })
    })

    it('should throw error with existing email', async () => {
      await expect(
        userApi.signup({
          email: 'existing@example.com',
          password: 'password123',
        })
      ).rejects.toThrow()
    })
  })

  describe('getMe', () => {
    it('should get user info when authenticated', async () => {
      storage.setToken('mock-jwt-token')
      const result = await userApi.getMe()

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      })
    })

    it('should throw error when not authenticated', async () => {
      await expect(userApi.getMe()).rejects.toThrow()
    })
  })
})

