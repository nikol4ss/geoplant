import { loginUser, refreshUser } from '@/api/modules/auth/auth.api';
import type { LoginPayload } from '@/models/modules/auth/auth.model';

import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    user: null as null | { id: number; name: string; surname: string; email: string },
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    setTokens(access: string, refresh: string) {
      this.accessToken = access;
      this.refreshToken = refresh;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    },

    logout() {
      this.accessToken = '';
      this.refreshToken = '';
      this.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },

    async login(payload: LoginPayload) {
      const response = await loginUser(payload);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro inesperado');
      }

      const { accessToken, refreshToken, user } = response.data;

      this.setTokens(accessToken, refreshToken);
      this.user = user;

      return response.data;
    },

    async refresh() {
      if (!this.refreshToken) throw new Error('Refresh token ausente');

      const response = await refreshUser({ refreshToken: this.refreshToken });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro ao atualizar token');
      }

      const { accessToken, user } = response.data;
      this.accessToken = accessToken;
      this.user = user;
      localStorage.setItem('accessToken', accessToken);

      return accessToken;
    },
  },
});
