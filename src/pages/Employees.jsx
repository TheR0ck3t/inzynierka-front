import { useState, useRef } from "react";
import AddEmployeeForm from "../components/employee/AddEmployeeForm";
import EmployeesList from "../components/employee/EmployeesList";
import logger from '../utils/logger';
import "../assets/styles/Employees.css";

const componentLogger = logger.createChildLogger('Employees');

export default function Employees() {
  const [showAddForm, setShowAddForm] = useState(false);
  const employeesListRef = useRef(null);

  // Funkcja obsługująca pomyślne dodanie pracownika
  const handleEmployeeAdded = () => {
    // Ukryj formularz po dodaniu
    setShowAddForm(false);
    
    // Odśwież listę pracowników używając referencji
    if (employeesListRef.current) {
      employeesListRef.current.refreshEmployees();
      componentLogger.debug("Refreshing employees list after adding new employee");
    }
  };

  return (
    <div className="employees">
      <h2>Lista pracowników</h2>
      
      {showAddForm ? (
        <AddEmployeeForm 
          onCancel={() => setShowAddForm(false)} 
          onSuccess={handleEmployeeAdded}
        />
      ) : (
        <button 
          type="button" 
          className="add-employee-btn" 
          onClick={() => setShowAddForm(true)}
        >
          Dodaj nowego pracownika
        </button>
      )}
      
      <EmployeesList ref={employeesListRef} />
    </div>
  );
}