import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './Layout';
import Pages from './Pages';
import setupAxios from './utils/axiosConfig';

export default function App() {
  document.title = import.meta.env.VITE_COMPANY_NAME || 'Zarządzanie Pracownikami';
  useEffect(() => {
    // Inicjalizacja interceptorów przy montowaniu komponentu
    setupAxios();
  }, []);

  return (
    <AuthProvider>
      <Layout>
        <Pages />
      </Layout>
    </AuthProvider>
  );
}