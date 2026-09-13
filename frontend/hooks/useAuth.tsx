import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService } from '@/services/auth';

type AppRole = 'user' | 'service_provider';

export interface AuthUser {
  id?: number | string;
  username?: string;
  email?: string;
  first_name?: string;
  role?: string;
  city?: string;
  phone?: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
    [key: string]: any;
  };
  is_staff?: boolean;
  is_superuser?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  loading: boolean;
  userRole: AppRole | null;
  signUp: (email: string, password: string, fullName: string, role: AppRole, phone?: string, city?: string, serviceType?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInAsDemo: (role?: AppRole) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<AppRole | null>(null);

  // App load hote hi Django se check karo ki user already logged-in hai ya nahi
  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserRole((currentUser.role as AppRole) || 'user');
      }
      setLoading(false);
    });
  }, []);

  // 1. Sign Up (Django Backend)
  const signUp = async (email: string, password: string, fullName: string, role: AppRole, phone?: string, city?: string, serviceType?: string) => {
    const { data, error } = await authService.signUp(email, password, fullName, role, phone, city, serviceType);
    if (error) {
      const errMessage = typeof error === 'object' ? JSON.stringify(error) : String(error);
      return { error: new Error(errMessage) };
    }
    if (data?.user) {
      setUser(data.user);
      setUserRole((data.user.role as AppRole) || role);
    }
    return { error: null };
  };


  // 2. Sign In (Django JWT)
  const signIn = async (email: string, password: string) => {
    const { data, error } = await authService.signIn(email, password);
    if (error) {
      const errMessage = typeof error === 'object' ? JSON.stringify(error) : String(error);
      return { error: new Error(errMessage) };
    }
    if (data?.user) {
      setUser(data.user);
      setUserRole((data.user.role as AppRole) || 'user');
    }
    return { error: null };
  };

  // 3. Demo Mode (Quick testing)
  const signInAsDemo = async (role: AppRole = 'user') => {
    const fakeUser: AuthUser = {
      id: 999,
      username: 'demo_user',
      email: role === 'user' ? 'demo@settleease.com' : 'provider@settleease.com',
      first_name: role === 'user' ? 'Demo User' : 'Demo Provider',
      city: 'Mumbai',
      role: role
    };

    setUser(fakeUser);
    setUserRole(role);
    return { error: null };
  };

  // 4. Sign Out
  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session: user ? { user } : null, loading, userRole, signUp, signIn, signInAsDemo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}