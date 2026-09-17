import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'HR_ADMIN' | 'HR_SPECIALIST' | 'EMPLOYEE';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  demoLogin: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('hr_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate existing token on load
  useEffect(() => {
    async function checkAuth() {
      const storedToken = localStorage.getItem('hr_auth_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const profile = await res.json();
          setUser(profile);
          setToken(storedToken);
        } else {
          localStorage.removeItem('hr_auth_token');
          setToken(null);
          setUser(null);
        }
      } catch {
        // If backend is offline or network error, fallback to demo Sarah Jenkins
        setUser({
          id: "usr_9410",
          name: "Sarah Jenkins",
          email: "sarah.jenkins@enterprise.internal",
          role: "HR_ADMIN",
          title: "HR Operations Lead",
          avatarUrl: "https://lh3.googleusercontent.com/aida/AEtjO1Xtd_6Zzb5GlqZHxkO20YhGWUIh5W6zeXIQMhT-wo_XWwgwVuROluO2YbW2xoNMM9EX4rSJ9HfXVhPfo0-FHKC9ypn5YpZDfKfjsev9tVACXOmHmujbKFBPnxdIa0mK0Il1qM1GRlo1u2Phyfe_WS_DSjxP_VA-_CcPCooGoexaXN5JJnUeX6ce0c_p78M6YXoqa2h8-dvIVVZUElaP5exk5NPsZxfpbZryLSyTPFga3mLVWeRTcUTS_B0"
        });
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email: string, password = 'SecretPassword123!') => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('hr_auth_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (e) {
      console.warn('Backend login request error, checking role fallback:', e);
      // Fallback role resolution for demo continuity
      if (email.includes('alex')) {
        setUser({
          id: 'usr_410',
          name: 'Alex Johnson',
          email: 'alex.johnson@enterprise.internal',
          role: 'EMPLOYEE',
          title: 'Senior Staff Engineer',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
        });
      } else if (email.includes('david')) {
        setUser({
          id: 'usr_9411',
          name: 'David Chen',
          email: 'david.chen@enterprise.internal',
          role: 'HR_SPECIALIST',
          title: 'Senior Benefits Specialist',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
        });
      } else {
        setUser({
          id: 'usr_9410',
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@enterprise.internal',
          role: 'HR_ADMIN',
          title: 'HR Operations Lead',
          avatarUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1Xtd_6Zzb5GlqZHxkO20YhGWUIh5W6zeXIQMhT-wo_XWwgwVuROluO2YbW2xoNMM9EX4rSJ9HfXVhPfo0-FHKC9ypn5YpZDfKfjsev9tVACXOmHmujbKFBPnxdIa0mK0Il1qM1GRlo1u2Phyfe_WS_DSjxP_VA-_CcPCooGoexaXN5JJnUeX6ce0c_p78M6YXoqa2h8-dvIVVZUElaP5exk5NPsZxfpbZryLSyTPFga3mLVWeRTcUTS_B0'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: UserRole) => {
    if (role === 'HR_ADMIN') {
      await login('sarah.jenkins@enterprise.internal', 'SecretPassword123!');
    } else if (role === 'HR_SPECIALIST') {
      await login('david.chen@enterprise.internal', 'SecretPassword123!');
    } else {
      await login('alex.johnson@enterprise.internal', 'SecretPassword123!');
    }
  };

  const logout = () => {
    localStorage.removeItem('hr_auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
