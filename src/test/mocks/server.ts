import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:8000'

const handlers = [
  // Auth - Login
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
      })
    }
    
    return HttpResponse.json(
      { detail: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  // Auth - Signup
  http.post(`${API_URL}/auth/signup`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    
    // Check for invalid email format (server-side validation)
    // This simulates backend rejecting emails that pass HTML5 validation but fail server validation
    if (body.email === 'invalid@email' || body.email === 'test@invalid') {
      return HttpResponse.json(
        { detail: 'value is not a valid email address' },
        { status: 422 }
      )
    }
    
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { detail: 'Email already registered' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      access_token: 'mock-jwt-token',
      token_type: 'bearer',
    })
  }),

  // Auth - Get Me
  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      created_at: '2024-01-01T00:00:00Z',
    })
  }),

  // Files - List
  http.get(`${API_URL}/files`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    
    return HttpResponse.json({
      files: [
        {
          id: 1,
          filename: 'test-file-1.pdf',
          original_filename: 'test-file-1.pdf',
          size: 1024000,
          content_type: 'application/pdf',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          user_id: 1,
        },
      ],
      total: 1,
      page,
      limit,
    })
  }),

  // Files - Delete
  http.delete(`${API_URL}/files/:id`, ({ params }) => {
    return HttpResponse.json({
      message: `File ${params.id} deleted successfully`,
    })
  }),
]

export const server = setupServer(...handlers)

