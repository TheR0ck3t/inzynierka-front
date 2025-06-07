import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funkcja sprawdzania statusu autoryzacji
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/check', {
        withCredentials: true
      });
      
      if (response.data?.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Sprawdzanie tylko przy pierwszym załadowaniu
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials, {
        withCredentials: true
      });
      
      if (response.status === 200) {
        // Sprawdź czy backend wymaga 2FA
        if (response.data.requires2FA) {
          return { 
            success: false, 
            requires2FA: true, 
            error: response.data.error 
          };
        }
        
        // Normalne logowanie bez 2FA
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, requires2FA: false };
      }
      
      return { success: false, requires2FA: false };    } catch (error) {
      return { 
        success: false, 
        requires2FA: false, 
        error: error.response?.data?.error || 'Błąd logowania'
      };
    }
  };

  const loginWith2FA = async (credentials, token2fa) => {
    try {
      const response = await axios.post('/api/auth/login', { ...credentials, token2fa }, {
        withCredentials: true
      });
      if (response.status === 200) {
        // Sprawdź czy backend dalej wymaga 2FA (błędny token)
        if (response.data.requires2FA) {
          return { 
            success: false, 
            requires2FA: true, 
            error: response.data.error 
          };
        }
        
        // Pomyślne logowanie z 2FA
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, requires2FA: false };
    } catch (error) {
      return { 
        success: false, 
        requires2FA: false, 
        error: error.response?.data?.error || 'Błąd logowania z 2FA'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      loginWith2FA,
      logout,
      refreshAuth: checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;