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
      // Przekieruj na stronę logowania przy błędach 401 (nieuprawniony dostęp)
      if (error.response && error.response.status === 401) {
        if (navigate) {
          navigate('/');
        } else {
          // Użyj React Router zamiast window.location
          if (window.history && window.history.pushState) {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          } else {
            window.location.href = '/';
          }
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