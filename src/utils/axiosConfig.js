import axios from 'axios';

/**
 * Konfiguruje axios dla autoryzacji z ciasteczkami JWT
 * @param {function} navigate - Funkcja nawigacji z React Router (opcjonalna)
 */
export const setupAxios = (navigate = null) => {
  // Kluczowe: Włącz przesyłanie ciasteczek z każdym zapytaniem
  axios.defaults.withCredentials = true;

  // Interceptor dla odpowiedzi - obsługa błędów autoryzacji
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Jeśli serwer zwraca 401 Unauthorized
      if (error.response && error.response.status === 401) {
        // Jeśli mamy funkcję navigate, użyj jej (preferowane)
        if (navigate) {
          navigate('/');
        } else {
          // Fallback na window.location jeśli navigate nie jest dostępne
          window.location.href = '/';
        }
      }
      return Promise.reject(error);
    }
  );
};

/**
 * Inicjalizacja podstawowych ustawień axios
 * Można użyć przed dostępem do obiektu navigate
 */
export const initAxios = () => {
  axios.defaults.withCredentials = true;
};

export default setupAxios;