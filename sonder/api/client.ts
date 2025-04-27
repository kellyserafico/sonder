import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ApiError {
  detail: string;
  status: number;
}

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
};

/**
 * Generic API request function with authentication handling
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions
): Promise<T> => {
  const { method, body, requiresAuth = true } = options;

  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (requiresAuth) {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      throw { detail: 'Authentication required', status: 401 } as ApiError;
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw { 
        detail: data.detail || 'Request failed', 
        status: response.status 
      } as ApiError;
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw { detail: error.message, status: 500 } as ApiError;
    }
    throw error;
  }
};

export const get = <T>(endpoint: string, requiresAuth = true) => 
  apiRequest<T>(endpoint, { method: 'GET', requiresAuth });

export const post = <T>(endpoint: string, data: any, requiresAuth = true) => 
  apiRequest<T>(endpoint, { method: 'POST', body: data, requiresAuth });

export const put = <T>(endpoint: string, data: any, requiresAuth = true) => 
  apiRequest<T>(endpoint, { method: 'PUT', body: data, requiresAuth });

export const del = <T>(endpoint: string, requiresAuth = true) => 
  apiRequest<T>(endpoint, { method: 'DELETE', requiresAuth });