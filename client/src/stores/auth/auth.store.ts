import { authenticateUser, refreshUser } from '@/api/modules/auth/auth.api';
import type { LoginPayload } from '@/models/modules/auth/auth.dto';

import { defineStore } from 'pinia';

import type { Session, User } from '@/types/auth.type';

const STORAGE_KEY = 'auth_session';

function loadSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Session) : null;
}

function persistSession(session: Session | null) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const session = loadSession();

    return {
      accessToken: session?.accessToken ?? (null as string | null),
      refreshToken: session?.refreshToken ?? (null as string | null),
      user: session?.user ?? (null as User | null),
      isRefreshing: false,
    };
  },

  getters: {
    isLoggedIn: (state) => state.user !== null && state.accessToken !== null,
  },

  actions: {
    setSession(session: Session | null) {
      if (!session) {
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        persistSession(null);
        return;
      }

      this.accessToken = session.accessToken;
      this.refreshToken = session.refreshToken;
      this.user = session.user;

      persistSession(session);
    },

    logout() {
      this.setSession(null);
    },

    async login(payload: LoginPayload) {
      this.logout(); 

      const response = await authenticateUser(payload);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Falha no login');
      }

      this.setSession(response.data);
      return response.data;
    },

    async refresh() {
      if (!this.refreshToken) {
        this.logout();
        throw new Error('Refresh token ausente');
      }

      if (this.isRefreshing) return this.accessToken;
      this.isRefreshing = true;

      try {
        const response = await refreshUser({
          refreshToken: this.refreshToken,
        });

        if (!response.success || !response.data) {
          throw new Error('Falha ao renovar sessão');
        }

        this.setSession({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken ?? this.refreshToken,
          user: response.data.user,
        });

        return this.accessToken;
      } catch (error) {
        this.logout();
        throw error;
      } finally {
        this.isRefreshing = false;
      }
    },
  },
});
