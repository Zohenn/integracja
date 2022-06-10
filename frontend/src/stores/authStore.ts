import create from 'zustand';
import axios from 'axios';

type Roles = 'user' | 'admin';

interface User {
  username: string;
  role: Roles;
}

interface AuthStore {
  user: User | null;
  isSignedIn: () => boolean;
  isAdmin: () => boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface LoginResponse extends User {
  token: string;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,

  isSignedIn: () => get().user !== null,
  isAdmin: () => get().isSignedIn() && get().user!.role === "admin",

  signIn: async (username, password) => {
    const response = await axios.post<LoginResponse>('/api/rest/users/authenticate', { username, password });

    const { token, ...user } = response.data;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    set({ user });
  },

  signOut: async () => {
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null });
  }
}));
