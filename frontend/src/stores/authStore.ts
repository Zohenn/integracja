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
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ user: { username: 'Username', role: 'user' }});
    return;

    const response = await axios.post<LoginResponse>('/api/rest/user/authenticate', { username, password });

    if(response.status === 200){
      const { token, ...user } = response.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user });
    } else if(response.status === 400){
      throw 'Bad credentials';
    } else {
      throw 'Login error';
    }
  },

  signOut: async () => {
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null });
  }
}));
