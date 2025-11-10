import { describe, it, expect } from 'vitest'
import { formatFileSize, formatDate, formatDateTime } from '../formatters'

describe('formatFileSize', () => {
  it('should format 0 bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 Bytes')
  })

  it('should format bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 Bytes')
  })

  it('should format KB correctly', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(2048)).toBe('2 KB')
  })

  it('should format MB correctly', () => {
    expect(formatFileSize(1048576)).toBe('1 MB')
    expect(formatFileSize(5242880)).toBe('5 MB')
  })

  it('should format GB correctly', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB')
  })

  it('should handle decimal values', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })
})

describe('formatDate', () => {
  it('should format ISO date string correctly', () => {
    const result = formatDate('2024-01-15T10:30:00Z')
    expect(result).toMatch(/Jan/)
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2024/)
  })
})

describe('formatDateTime', () => {
  it('should format ISO datetime string correctly', () => {
    const result = formatDateTime('2024-01-15T10:30:00Z')
    expect(result).toMatch(/Jan/)
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2024/)
    expect(result).toMatch(/\d{2}:\d{2}/)
  })
})

