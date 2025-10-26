import { LoginCredentials, AuthResponse, ErrorResponse } from '../types/types';

const API_BASE_URL ='http://localhost:8000';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as ErrorResponse).detail || 'Login failed');
    }

    return data as AuthResponse;
  }

  static async logout(): Promise<void> {
    const token = this.getToken();
    
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearToken();
  }

  static saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  static getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  static clearToken(): void {
    localStorage.removeItem('access_token');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}