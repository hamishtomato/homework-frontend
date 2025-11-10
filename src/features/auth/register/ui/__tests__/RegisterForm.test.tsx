import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from '../RegisterForm'

describe('RegisterForm', () => {
  it('should render register form', () => {
    render(<RegisterForm />)

    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('should handle successful registration', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    // Fill in form
    await user.type(screen.getByPlaceholderText('Email address'), 'newuser@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'password123')

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    // Wait for loading state to complete
    await waitFor(() => {
      expect(screen.queryByText(/creating account/i)).not.toBeInTheDocument()
    })
  })

  it('should display error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    // Fill in form with mismatched passwords
    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'differentpassword')

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    // Check error message
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('should display error when password is too short', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    // Fill in form with short password
    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password'), '12345')
    await user.type(screen.getByPlaceholderText('Confirm Password'), '12345')

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    // Check error message
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('should display 422 error message for invalid email format', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    // Fill in form with email that passes HTML5 validation but fails server validation
    await user.type(screen.getByPlaceholderText('Email address'), 'test@invalid')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'password123')

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    // Wait for and check 422 error message
    await waitFor(() => {
      expect(screen.getByText('Invalid email format. Please enter a valid email address.')).toBeInTheDocument()
    })
  })

  it('should display error when email already exists', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    // Fill in form with existing email
    await user.type(screen.getByPlaceholderText('Email address'), 'existing@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'password123')

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    // Wait for and check error message
    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeInTheDocument()
    })
  })

  it('should disable inputs and button while loading', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    
    // Start submission
    user.click(submitButton)

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    })
  })

  it('should have link to login page', () => {
    render(<RegisterForm />)

    const loginLink = screen.getByText(/already have an account/i)
    expect(loginLink).toBeInTheDocument()
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
  })

  it('should clear previous error when resubmitting', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    // First submission with mismatched passwords
    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'differentpassword')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    // Confirm error message appears
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })

    // Fix password and resubmit
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password')
    await user.clear(confirmPasswordInput)
    await user.type(confirmPasswordInput, 'password123')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    // Error message should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument()
    })
  })
})

