import { post } from './client';
import { API_URL } from '../config/api';

// Types
export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface TokenWithUserResponse extends TokenResponse {
  user: UserResponse;
}

/**
 * Register a new user
 */
export const registerUser = async (userData: SignUpData): Promise<UserResponse> => {
  try {
    const response = await fetch(`${API_URL}/user/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.detail || 'Registration failed';
      throw { detail: errorMessage, status: response.status };
    }

    return data as UserResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw { detail: error.message, status: 500 };
    }
    throw error;
  }
};

/**
 * Login a user
 */
export const loginUser = async (loginData: LoginData): Promise<TokenWithUserResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/mobile-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.detail || 'Login failed';
      throw { detail: errorMessage, status: response.status };
    }

    return data as TokenWithUserResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw { detail: error.message, status: 500 };
    }
    throw error;
  }
};

/**
 * Refresh the authentication token
 */
export const refreshToken = async (): Promise<TokenResponse> => {
  return post<TokenResponse>('/auth/refresh', {});
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<UserResponse> => {
  return post<UserResponse>('/auth/me', {});
};