import { loginUser, refreshUser } from '@/api/modules/auth/auth.api';
import type { LoginPayload } from '@/models/modules/auth/auth.model';

import { defineStore } from 'pinia';

/**
 * Auth Store
 * Responsável por gerenciar o estado de autenticação do usuário.
 * Guarda tokens, dados do usuário e fornece métodos para login, logout e refresh.
 */
export const useAuthStore = defineStore('auth', {
  /**
   * State
   * Armazena os tokens e dados do usuário.
   * - accessToken: Token de acesso para autenticação.
   * - refreshToken: Token para renovar o accessToken.
   * - user: Objeto com dados do usuário (id, name, surname, email) ou null.
   * Observação: Os valores iniciais são carregados do localStorage se existirem.
   */
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null') as null | {
      id: number;
      name: string;
      surname: string;
      email: string;
    },
  }),

  /**
   * Getters
   * Funções que derivam dados do estado.
   */
  getters: {
    // Retorna true se o usuário estiver logado (ou seja, existir accessToken)
    isLoggedIn: (state) => !!state.accessToken,
  },

  /**
   * Actions
   * Métodos para manipular o estado: login, logout, refresh e gerenciamento de tokens.
   */
  actions: {
    /**
     * setTokens
     * Salva os tokens no estado e no localStorage.
     * Opcionalmente, recebe o objeto `user` para salvar também.
     */
    setTokens(
      access: string,
      refresh: string,
      user?: { id: number; name: string; surname: string; email: string },
    ) {
      this.accessToken = access;
      this.refreshToken = refresh;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }
    },

    /**
     * logout
     * Limpa tokens e dados do usuário, removendo também do localStorage.
     */
    logout() {
      this.accessToken = '';
      this.refreshToken = '';
      this.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },

    /**
     * login
     * Realiza login usando email e senha (LoginPayload).
     * Atualiza tokens e dados do usuário no estado e localStorage.
     */
    async login(payload: LoginPayload) {
      const response = await loginUser(payload);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erro inesperado');
      }

      const { accessToken, refreshToken, user } = response.data;

      // Salva tokens e user no estado/localStorage
      this.setTokens(accessToken, refreshToken, user);

      return response.data;
    },

    /**
     * refresh
     * Renova o accessToken usando o refreshToken.
     * Atualiza accessToken e user no estado e localStorage.
     */
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
      localStorage.setItem('user', JSON.stringify(user));

      return accessToken;
    },
  },
});
