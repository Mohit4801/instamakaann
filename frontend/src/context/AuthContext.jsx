import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import api from '../lib/api';

const TOKEN_KEY = 'instamakaan_token';
const USER_KEY = 'instamakaan_user';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

/* 🔐 Simple JWT decode (NO library, same as before) */
const decodeJWT = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= INIT ================= */
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
  setError(null);
  setLoading(true);

  try {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, email_verified } = res.data;

    // 🔴 BLOCK LOGIN IF EMAIL NOT VERIFIED
    if (email_verified === false) {
      return {
        success: false,
        error: 'Please verify your email before logging in',
        needsVerification: true,
      };
    }

    if (!access_token) throw new Error('Invalid login response');

    const decoded = decodeJWT(access_token);

    const userObj = {
      email,
      role: decoded?.role || 'USER',
    };

    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(userObj));
    setUser(userObj);

    return { success: true, user: userObj };
  } catch (err) {
    const msg =
      err.response?.data?.detail || 'Invalid credentials';

    return { success: false, error: msg };
  } finally {
    setLoading(false);
  }
};

  /* ================= REGISTER (USER ONLY) ================= */
  const register = async (name, email, password) => {
    setError(null);
    setLoading(true);

    try {
      await api.post('/auth/register', { name, email, password });
      return { success: true }; // ❗ no auto-login
    } catch (err) {
      const detail = err.response?.data?.detail;

      let msg = 'Registration failed';

      if (typeof detail === 'string') {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail[0]?.msg || msg;
      }

      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isOwner: user?.role === 'OWNER',
        isAgent: user?.role === 'AGENT',
        isUser: user?.role === 'USER',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
