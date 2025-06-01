import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './page';
import '@testing-library/jest-dom';

// Mock the fetch API
global.fetch = jest.fn();

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    mockOnLoginSuccess.mockClear();
  });

  const renderLogin = () => {
    return render(
      <MemoryRouter>
        <Login onLoginSuccess={mockOnLoginSuccess} />
      </MemoryRouter>
    );
  };

  test('renders login form correctly', () => {
    renderLogin();
    
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Create an account/i })).toBeInTheDocument();
  });

  test('shows username error when username is missing', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Missing username.' }),
    });

    renderLogin();
    
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter username.')).toBeInTheDocument();
    });
  });

  test('shows password error when password is missing', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Missing password.' }),
    });

    renderLogin();
    
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { value: 'testuser' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter password.')).toBeInTheDocument();
    });
  });

  test('shows both errors when all fields are missing', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'All fields are required.' }),
    });

    renderLogin();
    
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter username.')).toBeInTheDocument();
      expect(screen.getByText('Please enter password.')).toBeInTheDocument();
    });
  });

  test('shows general error message when login fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    renderLogin();
    
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { value: 'wrongpass' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('successful login navigates to calendar and calls onLoginSuccess', async () => {
    const mockToken = 'test-token-123';
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken }),
    });

    renderLogin();
    
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { value: 'correctpass' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: 'testuser', 
          pwd: 'correctpass' 
        }),
      });
      expect(mockOnLoginSuccess).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/Calendar');
    });
  });

  test('handles network error during login', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderLogin();
    
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { value: 'testpass' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});