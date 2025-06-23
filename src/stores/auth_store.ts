import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/User/User';
import { AuthState } from '@/types/Auth/AuthState';
import { AuthService } from '@/services';

interface AuthStore extends AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      setToken: (token: string) => {
        set({ token });
      },
        setRefreshToken: (refreshToken: string) => {
            set({ refreshToken });
        },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await AuthService.login(email, password);

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await AuthService.register(name, email, password);

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        try {
          set({ isLoading: true });
          const response = await AuthService.getMe();

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Token invalide, déconnexion
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updatePassword: async (currentPassword: string, newPassword: string) => {
        try {
          set({ isLoading: true });
          await AuthService.updatePassword(currentPassword, newPassword);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);