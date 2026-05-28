// API Client Service - Centralized API logic for tickets microservice
import { authService } from '../services/authService';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  baseUrl?: string;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Get authentication headers from localStorage
 * Returns headers with Bearer token if available
 */
export const getAuthHeaders = (): Record<string, string> => {
  const idToken = localStorage.getItem('id_token');
  if (idToken) {
    return {
      'Authorization': `Bearer ${idToken}`,
    };
  }
  return {};
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('id_token');
  const expiresAt = localStorage.getItem('token_expires_at');
  
  if (!token || !expiresAt) return false;
  
  return Date.now() < parseInt(expiresAt, 10);
};

// Support multiple API base URLs
const API_URLS = {
  TUNNEL: 'https://docs-dev.dhaamai.com',
  LOCAL: 'http://127.0.0.1:8000',
};
// "https://docs-dev.dhaamai.com/docs"
//"https://docs-dev.dhaamai.com"

class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheExpiryMs = 5 * 60 * 1000; // 5 minutes default cache

  constructor(baseUrl = API_URLS.TUNNEL, timeout = DEFAULT_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Make a generic API request with error handling and logging
   */
  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {},
    _retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      baseUrl = this.baseUrl,
      timeout = this.timeout,
    } = options;

    const url = `${baseUrl}${endpoint}`;
    const authHeaders = getAuthHeaders();
    const mergedHeaders = { ...DEFAULT_HEADERS, ...authHeaders, ...headers };

    // Check cache for GET requests
    if (method === 'GET' && this.isCached(url)) {
      console.log('[ApiClient] Cache hit:', url);
      return { success: true, data: this.getFromCache(url), status: 200 };
    }

    try {
      console.log(`[ApiClient] ${method} ${url}`, body ? `Body: ${JSON.stringify(body)}` : '');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Clone response to read body multiple times if needed
      const responseText = await response.clone().text();
      let responseData: any;

      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        responseData = responseText;
      }

      console.log(
        `[ApiClient] Response: ${response.status} ${response.statusText}`,
        responseData
      );

      // Handle 401 Unauthorized - attempt token refresh and retry (max 1 retry)
      if (response.status === 401 && _retryCount < 1) {
        console.log('[ApiClient] 401 Unauthorized - Attempting token refresh');
        try {
          const refreshed = await authService.refreshToken();
          if (refreshed) {
            console.log('[ApiClient] Token refresh successful - Retrying request');
            // Retry the request once with refreshed token
            return this.request<T>(endpoint, options, _retryCount + 1);
          }
        } catch (refreshError) {
          console.error('[ApiClient] Token refresh failed:', refreshError);
        }
        
        return {
          success: false,
          error: `HTTP ${response.status}: ${
            typeof responseData === 'string' ? responseData : JSON.stringify(responseData)
          }`,
          status: response.status,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${
            typeof responseData === 'string' ? responseData : JSON.stringify(responseData)
          }`,
          status: response.status,
        };
      }

      // Cache successful GET responses
      if (method === 'GET' && responseData) {
        this.setInCache(url, responseData);
      }

      return {
        success: true,
        data: responseData,
        status: response.status,
      };
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError'
        ? `Request timeout (${timeout}ms)`
        : error.message || 'Unknown error';

      console.error(`[ApiClient] Error:`, errorMessage);

      return {
        success: false,
        error: errorMessage,
        status: 0,
      };
    }
  }

  /**
   * POST request - convenience method
   */
  async post<T = any>(
    endpoint: string,
    body: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request - convenience method
   */
  async put<T = any>(
    endpoint: string,
    body: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * PATCH request - convenience method
   */
  async patch<T = any>(
    endpoint: string,
    body: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * GET request - convenience method
   */
  async get<T = any>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * DELETE request - convenience method
   */
  async delete<T = any>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Cache management
   */
  private isCached(url: string): boolean {
    const cached = this.cache.get(url);
    if (!cached) return false;
    const isExpired = Date.now() - cached.timestamp > this.cacheExpiryMs;
    if (isExpired) {
      this.cache.delete(url);
      return false;
    }
    return true;
  }

  private getFromCache(url: string): any {
    return this.cache.get(url)?.data || null;
  }

  private setInCache(url: string, data: any): void {
    this.cache.set(url, { data, timestamp: Date.now() });
  }

  /**
   * Clear cache
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      const keys = Array.from(this.cache.keys()).filter((k) => k.includes(pattern));
      keys.forEach((k) => this.cache.delete(k));
    } else {
      this.cache.clear();
    }
  }
}

// Export singleton instances for different APIs
export const apiClientTunnel = new ApiClient(API_URLS.TUNNEL);
export const apiClientLocal = new ApiClient(API_URLS.LOCAL);

// Default to tunnel client
export const apiClient = apiClientTunnel;

export { API_URLS };

export default ApiClient;
