import { API_URL } from '../config/api';

// Type definitions
export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}

export interface ApiError {
  detail: string;
  status: number;
}

/**
 * Register a new user
 * @param userData User registration data
 * @returns Promise with user data
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
      throw { detail: errorMessage, status: response.status } as ApiError;
    }

    return data as UserResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw { detail: error.message, status: 500 } as ApiError;
    } else {
      throw error as ApiError;
    }
  }
};