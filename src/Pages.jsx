import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from './hooks/useAuth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EditEmployee from './components/employee/EditEmployee';
import AccountSettings from "./pages/AccountSettings";
import Statistics from "./pages/Statistics";
import Logs from "./pages/Logs";
import Error404 from "./pages/Error404";
import Users from "./pages/Users";
import HealthStatus from "./pages/HealthStatus";
import FirstLoginPasswordChange from "./pages/FirstLoginPasswordChange";

// Komponent chronionej trasy
const ProtectedRoute = ({ children }) => {
  const {isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};


export default function Pages() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Strona główna - renderuje Home gdy niezalogowany, Dashboard gdy zalogowany */}
      <Route path="/" element={
        isAuthenticated ? <Dashboard /> : <Home />
      } />
      
      <Route path="/employees" element={
        <ProtectedRoute>
          <Employees />
        </ProtectedRoute>
      } />
      
      <Route path="/employees/update/:id" element={
        <ProtectedRoute>
          <EditEmployee />
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

      <Route path="/users" element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      } />

      <Route path="/Status" element={
        <ProtectedRoute>
          <HealthStatus />
        </ProtectedRoute>
      } />

      {/* Zmiana hasła przy pierwszym logowaniu */}
      <Route path="/change-password-first-login" element={
        <ProtectedRoute>
          <FirstLoginPasswordChange />
        </ProtectedRoute>
      } />

      
      {/* Przekierowanie nieznanych ścieżek */}
      <Route path="*" element={
        <Error404 />
      } />
      
    </Routes>
  );
}