import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

interface AuthStore extends AuthState {
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      initialize: async () => {
        if (!isSupabaseConfigured()) {
          console.warn('Supabase is not configured. Using mock authentication.');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          set({
            isAuthenticated: true,
            user: {
              id: session.user.id,
              name: session.user.user_metadata.name || 'User',
              email: session.user.email || '',
              role: session.user.role || 'user',
            },
          });
        }
      },
      login: async (email: string, password: string) => {
        if (!isSupabaseConfigured()) {
          if (email === 'admin@example.com' && password === 'password') {
            set({
              isAuthenticated: true,
              user: {
                id: 'mock-user-id',
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'admin',
              },
            });
            return;
          }
          throw new Error('Invalid credentials');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          set({
            isAuthenticated: true,
            user: {
              id: data.user.id,
              name: data.user.user_metadata.name || 'User',
              email: data.user.email || '',
              role: data.user.role || 'user',
            },
          });
        }
      },
      logout: async () => {
        if (isSupabaseConfigured()) {
          await supabase.auth.signOut();
        }
        set(initialState);
      },
    }),
    {
      name: 'auth-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return { ...initialState, ...persistedState };
        }
        return persistedState as AuthState;
      },
    }
  )
);