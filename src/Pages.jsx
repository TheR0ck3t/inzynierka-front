import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from './hooks/useAuth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AccountSettings from "./pages/AccountSettings";
import Statistics from "./pages/Statistics";
import Logs from "./pages/Logs";

// Komponent chronionej trasy
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default function Pages() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Strona główna / logowanie */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />
      } />
      
      {/* Chronione trasy */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/employees" element={
        <ProtectedRoute>
          <Employees />
        </ProtectedRoute>
      } />
      
      <Route path="/account-settings" element={
        <ProtectedRoute>
          <AccountSettings />
        </ProtectedRoute>
      } />

      <Route path="/statistics" element={
        <ProtectedRoute>
          <Statistics />
        </ProtectedRoute>
      } />

      <Route path="/logs" element={
        <ProtectedRoute>
          <Logs />
        </ProtectedRoute>
      } />
      
      {/* Przekierowanie nieznanych ścieżek */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}