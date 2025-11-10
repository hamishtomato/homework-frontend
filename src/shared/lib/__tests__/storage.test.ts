import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from '../storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('setToken and getToken', () => {
    it('should store and retrieve token', () => {
      const token = 'test-jwt-token'
      storage.setToken(token)
      expect(storage.getToken()).toBe(token)
    })

    it('should return null when no token exists', () => {
      expect(storage.getToken()).toBeNull()
    })
  })

  describe('removeToken', () => {
    it('should remove token from storage', () => {
      storage.setToken('test-token')
      storage.removeToken()
      expect(storage.getToken()).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      storage.setToken('test-token')
      expect(storage.isAuthenticated()).toBe(true)
    })

    it('should return false when token does not exist', () => {
      expect(storage.isAuthenticated()).toBe(false)
    })
  })
})

