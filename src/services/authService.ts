// Auth Service - Centralized authentication API logic
const API_BASE_URL = 'https://docs-dev.dhaamai.com/analytics/';

// Types
export interface CheckUserRequest {
  identifier: string;
  identifier_type: 'phone' | 'email';
  tenant_id: string;
}

export interface CheckUserResponse {
  success: boolean;
  data: {
    exists: boolean;
    roles?: Array<{
      role_id: number;
      role_name: string;
    }>;
  };
  meta: {
    request_id: string;
    timestamp: string;
  };
}

export interface InitiateOTPRequest {
  identifier: string;
  country_code: string;
  identifier_type: 'phone' | 'email';
  tenant_id: string;
  role_id: string;
}

export interface InitiateOTPResponse {
  success: boolean;
  data: {
    session: string;
    username: string;
    challenge_name: string;
    message: string;
  };
  meta: {
    request_id: string;
    timestamp: string;
  };
}

export interface VerifySignupRequest {
  identifier: string;
  identifier_type: 'phone' | 'email';
  country_code: string;
  session: string;
  otp_code: string;
  username: string;
  tenant_id: string;
  role_id: string;
  device_info: {
    device_id: string;
    device_name: string;
    device_type: string;
    os_version: string;
    app_version: string;
    ip_address: string;
    user_agent: string;
  };
}

export interface VerifySignupResponse {
  success: boolean;
  data: {
    id_token: string;
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user?: {
      user_id: string;
      roles: Array<{
        role_id: number;
        role_name: string;
      }>;
    };
  };
  meta: {
    request_id: string;
    timestamp: string;
  };
}

export interface VerifyLoginRequest {
  identifier: string;
  identifier_type: 'phone' | 'email';
  country_code: string;
  session: string;
  otp_code: string;
  username: string;
  tenant_id: string;
  role_id: string;
  device_info: {
    device_id: string;
    device_name: string;
    device_type: string;
    os_version: string;
    app_version: string;
    ip_address: string;
    user_agent: string;
  };
}

export interface RefreshTokenRequest {
  user_id: string;
  tenant_id: string;
  role: number | string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    id_token: string;
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
  meta: {
    request_id: string;
    timestamp: string;
  };
}

export interface AuthError {
  success: false;
  error: string;
  message?: string;
}

// Generate unique device ID
const generateDeviceId = (): string => {
  const existingId = localStorage.getItem('device_id');
  if (existingId) return existingId;
  
  const newId = `web_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem('device_id', newId);
  return newId;
};

// Get device info for API calls
const getDeviceInfo = () => ({
  device_id: generateDeviceId(),
  device_name: navigator.userAgent.includes('Windows') ? 'Windows PC' : 
               navigator.userAgent.includes('Mac') ? 'Mac' : 
               navigator.userAgent.includes('Linux') ? 'Linux PC' : 'Web Browser',
  device_type: 'web',
  os_version: navigator.platform || 'Unknown',
  app_version: '1.0.0',
  ip_address: '0.0.0.0', // Will be detected server-side
  user_agent: navigator.userAgent,
});

class AuthService {
  private baseUrl: string;
  private tenantId: string;

  constructor(baseUrl = API_BASE_URL, tenantId = '12345') {
    this.baseUrl = baseUrl;
    this.tenantId = tenantId;
  }

  /**
   * Check if a user exists by phone number
   */
  async checkUser(phoneNumber: string): Promise<CheckUserResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: phoneNumber,
          identifier_type: 'phone',
          tenant_id: this.tenantId,
        } as CheckUserRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[AuthService] Check user response:', data);
      return data;
    } catch (error) {
      console.error('[AuthService] Check user error:', error);
      throw error;
    }
  }

  /**
   * Initiate OTP for signup (new user)
   */
  async initiateSignupOTP(
    phoneNumber: string, 
    countryCode: string = '+91',
    roleId: string = '1'
  ): Promise<InitiateOTPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/otp/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: phoneNumber,
          country_code: countryCode,
          identifier_type: 'phone',
          tenant_id: this.tenantId,
          role_id: roleId,
        } as InitiateOTPRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[AuthService] Initiate OTP response:', data);
      return data;
    } catch (error) {
      console.error('[AuthService] Initiate OTP error:', error);
      throw error;
    }
  }

  /**
   * Initiate OTP for login (existing user)
   */
  async initiateLoginOTP(
    phoneNumber: string,
    countryCode: string = '+91',
    roleId: string = '1'
  ): Promise<InitiateOTPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/otp/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: phoneNumber,
          country_code: countryCode,
          identifier_type: 'phone',
          tenant_id: this.tenantId,
          role_id: roleId,
        } as InitiateOTPRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[AuthService] Initiate Login OTP response:', data);
      return data;
    } catch (error) {
      console.error('[AuthService] Initiate Login OTP error:', error);
      throw error;
    }
  }

  /**
   * Verify OTP and complete signup
   */
  async verifySignup(
    phoneNumber: string,
    countryCode: string,
    session: string,
    otpCode: string,
    username: string,
    roleId: string = '1'
  ): Promise<VerifySignupResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/otp/verify/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en',
        },
        body: JSON.stringify({
          identifier: phoneNumber,
          identifier_type: 'phone',
          country_code: countryCode,
          session: session,
          otp_code: otpCode,
          username: username,
          tenant_id: this.tenantId,
          role_id: roleId,
          device_info: getDeviceInfo(),
        } as VerifySignupRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[AuthService] Verify signup response:', data);
      
      // Store tokens
      if (data.success && data.data) {
        this.storeTokens(data.data);
      }
      
      return data;
    } catch (error) {
      console.error('[AuthService] Verify signup error:', error);
      throw error;
    }
  }

  /**
   * Verify OTP and complete login
   */
  async verifyLogin(
    phoneNumber: string,
    countryCode: string,
    session: string,
    otpCode: string,
    username: string,
    roleId: string = '1'
  ): Promise<VerifySignupResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/otp/verify/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en',
        },
        body: JSON.stringify({
          identifier: phoneNumber,
          identifier_type: 'phone',
          country_code: countryCode,
          session: session,
          otp_code: otpCode,
          username: username,
          tenant_id: this.tenantId,
          role_id: roleId,
          device_info: getDeviceInfo(),
        } as VerifyLoginRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[AuthService] Verify login response:', data);
      
      // Store tokens
      if (data.success && data.data) {
        this.storeTokens(data.data);
      }
      
      return data;
    } catch (error) {
      console.error('[AuthService] Verify login error:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication tokens
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const user = this.getUser();
      
      if (!refreshToken || !user) {
        console.warn('[AuthService] No refresh token or user info available');
        return false;
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en',
        },
        body: JSON.stringify({
          user_id: user.user_id || user.id,
          tenant_id: this.tenantId,
          role: user.roles?.[0]?.role_id || 1,
          refresh_token: refreshToken,
        } as RefreshTokenRequest),
      });

      if (!response.ok) {
        // If refresh fails, logout user
        if (response.status === 401 || response.status === 403) {
          console.log('[AuthService] Token refresh failed with 401/403 - logging out');
          this.logout();
          window.location.href = '/auth/login';
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[AuthService] Token refresh successful:', data);
      
      // Store new tokens
      if (data.success && data.data) {
        this.storeTokens(data.data);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[AuthService] Token refresh error:', error);
      // Logout on refresh failure
      this.logout();
      return false;
    }
  }

  /**
   * Store authentication tokens
   */
  private storeTokens(data: VerifySignupResponse['data'] | RefreshTokenResponse['data']) {
    if (data.id_token) {
      localStorage.setItem('id_token', data.id_token);
    }
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    if (data.expires_in) {
      const expiresAt = Date.now() + data.expires_in * 1000;
      localStorage.setItem('token_expires_at', expiresAt.toString());
    }
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Get stored id token
   */
  getIdToken(): string | null {
    return localStorage.getItem('id_token');
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get stored user info
   */
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if token is expired or about to expire (within 5 minutes)
   */
  isTokenExpiredOrExpiring(): boolean {
    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return true;
    
    const expiresAtMs = parseInt(expiresAt, 10);
    const now = Date.now();
    const fiveMinutesMs = 5 * 60 * 1000;
    
    return now >= (expiresAtMs - fiveMinutesMs);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getIdToken();
    const expiresAt = localStorage.getItem('token_expires_at');
    
    if (!token || !expiresAt) return false;
    
    return Date.now() < parseInt(expiresAt, 10);
  }

  /**
   * Logout - clear all stored auth data
   */
  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('user');
    localStorage.removeItem('device_id');
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
