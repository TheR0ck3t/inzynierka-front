import useAuth from './hooks/useAuth';
import Menu from './components/layout/Menu';

export default function Layout({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Ładowanie...</div>;
  }

  if (!isAuthenticated) {
    // Dla niezalogowanych użytkowników - tylko zawartość bez menu
    return <div className="content-only">{children}</div>;
  }

  // Dla zalogowanych użytkowników - pełny układ z menu
  return (
    <div className="app">
      <Menu />
      <main className="content">
        {children}
      </main>
    </div>
  );
}