import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sprawdzanie statusu autoryzacji przy ładowaniu
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Konfiguruj axios aby wysyłał ciasteczka
        axios.defaults.withCredentials = true;
        
        // Wysyła zapytanie do API, które sprawdza ważność tokenu w ciasteczkach
        const response = await axios.get('/api/auth/check');
        
        if (response.data && response.data.isAuthenticated) {
          setIsAuthenticated(true);
          
          // Poprawione ustawienie danych użytkownika
          if (response.data.user) {
            const userData = response.data.user;
            setUser(userData);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Błąd sprawdzania statusu autoryzacji:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      // Upewnij się, że credentials wysyłane są z opcją withCredentials
      const response = await axios.post('/api/auth/login', credentials, {
        withCredentials: true
      });
      
      // Jeśli logowanie się powiodło, backend ustawi ciasteczko automatycznie
      if (response.data && response.status === 200) {
        // Ustaw stan użytkownika na podstawie odpowiedzi z API
        if (response.data.user) {
          setUser(response.data.user);
        }
        
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Błąd logowania:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Wywołaj endpoint wylogowania, który usunie ciasteczko
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;