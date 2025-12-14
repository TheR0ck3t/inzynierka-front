import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from './hooks/useAuth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EditEmployee from './components/employee/editEmployee';
import AccountSettings from "./pages/AccountSettings";
import Statistics from "./pages/Statistics";
import Logs from "./pages/Logs";
import Error404 from "./pages/Error404";
import ITDepartment from "./pages/ITDeptartment";
import HRDepartment from "./pages/HRDepartment";

// Komponent chronionej trasy
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};


export default function Pages() {
  const { isAuthenticated, user } = useAuth();

  const departmentPage = user?.department_name ? (
    user.department_name === 'IT' ? (
      <ITDepartment />
    ) : user.department_name === 'HR' ? (
      <HRDepartment />
    ) : (
      <Dashboard />
    )
  ) : (
    <Dashboard /> // Jeśli nie ma departamentu, wyświetl Dashboard
  );
  

  return (
    <Routes>
      {/* Strona główna - renderuje Home gdy niezalogowany, Dashboard gdy zalogowany */}
      <Route path="/" element={
        isAuthenticated ? departmentPage : <Home />
      } />

      {/* Trasa Zależna od działu */}
      <Route path ="/" element={
        <ProtectedRoute>
          {departmentPage}
        </ProtectedRoute>
      } />
      
      {/* Pozostałe chronione trasy */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
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
      
      {/* Przekierowanie nieznanych ścieżek */}
      <Route path="*" element={
        <Error404 />
      } />
    </Routes>
  );
}