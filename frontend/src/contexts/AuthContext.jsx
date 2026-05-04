import { createContext, useContext, useState, useEffect } from 'react';
import { authService, delegateService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delegateSession, setDelegateSession] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const res = await authService.login(formData);
      localStorage.setItem('token', res.data.access_token);
      const userRes = await authService.getMe();
      setUser(userRes.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
      return false;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await authService.register({ name, email, password });
      localStorage.setItem('token', res.data.access_token);
      const userRes = await authService.getMe();
      setUser(userRes.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    setError(null);
    try {
      const res = await authService.updateProfile(data);
      setUser(res.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al actualizar perfil');
      return false;
    }
  };

  const activateDelegate = async (token) => {
    setError(null);
    try {
      const res = await delegateService.activateDelegate(token);
      localStorage.setItem('delegate_token', res.data.access_token);
      setDelegateSession({
        tournamentId: res.data.tournament_id,
        permissions: res.data.permissions,
        restrictions: res.data.restrictions,
        expiresAt: res.data.expires_at,
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al activar sesión de editor');
      return false;
    }
  };

  const deactivateDelegate = async () => {
    try {
      await delegateService.deactivateDelegate();
    } catch (err) {
      console.error('Deactivate delegate error:', err);
    }
    localStorage.removeItem('delegate_token');
    setDelegateSession(null);
  };

  useEffect(() => {
    const delegateToken = localStorage.getItem('delegate_token');
    if (delegateToken) {
      try {
        const payload = JSON.parse(atob(delegateToken.split('.')[1]));
        if (payload.delegate && payload.tournament_id) {
          setDelegateSession({
            tournamentId: payload.tournament_id,
            permissions: payload.permissions || [],
            restrictions: payload.restrictions || [],
            expiresAt: payload.exp,
          });
        }
      } catch (e) {
        localStorage.removeItem('delegate_token');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile, delegateSession, activateDelegate, deactivateDelegate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};