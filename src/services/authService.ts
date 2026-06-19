// ==========================================
// Auth Service - Token Manager (micro-frontend)
//
// Login/signup/OTP flow lives ONLY in chatsupport-main (the host).
// After the host authenticates it writes tokens to localStorage.
// This service just reads those tokens, checks expiry, and refreshes them.
// ==========================================

const AUTH_API_BASE_URL = 'https://dev-nexus.dhaamai.com/api/v1';
const DEFAULT_TENANT_ID = '12775';

function getTenantId(): string {
  const stored = localStorage.getItem('tenantId');
  if (stored) return stored;
  try {
    const token = localStorage.getItem('id_token');
    if (token) {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(b64));
      const gn: string = payload.given_name ?? '';
      if (gn.includes('::')) {
        const t = gn.split('::')[0]; // "tenantId::roleId::userId"
        if (/^\d+$/.test(t)) return t;
      }
    }
  } catch { /* ignore */ }
  return DEFAULT_TENANT_ID;
}

export interface RefreshTokenRequest {
  user_id: string;
  tenant_id: number;
  role: number;
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
  meta: { request_id: string; timestamp: string };
}

class AuthService {
  private readonly baseUrl: string;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl = AUTH_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async refreshToken(): Promise<boolean> {
    if (this.refreshPromise) {
      console.log('[AuthService] Refresh already in progress');
      return this.refreshPromise;
    }
    this.refreshPromise = this._doRefresh();
    try { return await this.refreshPromise; }
    finally { this.refreshPromise = null; }
  }

  private async _doRefresh(): Promise<boolean> {
    try {
      const rt = localStorage.getItem('refresh_token');
      if (!rt) { console.warn('[AuthService] No refresh token'); return false; }
      const user = this.getUser();
      const role = user?.role_id || user?.roles?.[0]?.role_id || 1;

      // JWT given_name is "tenantId::roleId::userId" for chatsupport
      let userId = user?.user_id || user?.id || '';
      if (!userId) {
        try {
          const idTok = localStorage.getItem('id_token');
          if (idTok) {
            const b64 = idTok.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const decoded = JSON.parse(atob(b64));
            const gn: string = decoded.given_name ?? '';
            const parts = gn.split('::');
            const fromJwt = parts[2] ?? ''; // index 2 = userId
            if (/^\d+$/.test(fromJwt)) {
              userId = fromJwt;
              console.log('[AuthService] user_id from JWT:', userId);
            }
          }
        } catch { /* ignore malformed token */ }
      }
      if (!userId) { console.warn('[AuthService] No user_id for refresh'); return false; }

      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: String(userId),
          tenant_id: parseInt(getTenantId(), 10),
          role: typeof role === 'number' ? role : parseInt(String(role), 10) || 1,
          refresh_token: rt,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('[AuthService] Refresh failed:', res.status, err);
        if (res.status === 401 || res.status === 403) {
          this.logout();
          localStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
        }
        return false;
      }

      const data = await res.json();
      if (data?.data) { this.storeTokens(data.data); return true; }
      return false;
    } catch (e) { console.error('[AuthService] Refresh error:', e); return false; }
  }

  private storeTokens(d: RefreshTokenResponse['data']) {
    if (d.id_token) localStorage.setItem('id_token', d.id_token);
    if (d.access_token) localStorage.setItem('access_token', d.access_token);
    if (d.refresh_token) localStorage.setItem('refresh_token', d.refresh_token);
    if (d.expires_in) localStorage.setItem('token_expires_at', String(Date.now() + d.expires_in * 1000));
  }

  getRefreshToken(): string | null { return localStorage.getItem('refresh_token'); }
  getIdToken(): string | null { return localStorage.getItem('id_token'); }
  getAccessToken(): string | null { return localStorage.getItem('access_token'); }
  getUser(): any { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; }

  isTokenExpiredOrExpiring(): boolean {
    const e = localStorage.getItem('token_expires_at');
    if (!e) return true;
    return Date.now() >= parseInt(e, 10) - 5 * 60 * 1000;
  }

  isAuthenticated(): boolean {
    const t = this.getIdToken();
    const e = localStorage.getItem('token_expires_at');
    if (!t || !e) return false;
    return Date.now() < parseInt(e, 10);
  }

  logout() {
    ['id_token','access_token','refresh_token','token_expires_at','user','device_id']
      .forEach(k => localStorage.removeItem(k));
  }

  /**
   * Decodes the id_token JWT and extracts userId, tenantId, and roleId from given_name.
   */
  private getDecodedUser(): { userId?: string; tenantId?: string; roleId?: string } | null {
    const idTok = localStorage.getItem('id_token');
    if (!idTok) return null;
    try {
      const b64 = idTok.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(b64));
      const gn = decoded.given_name ?? '';
      // given_name format: "userId::tenantId::roleId"
      const [userId, tenantId, roleId] = gn.split('::');
      return { userId, tenantId, roleId };
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;