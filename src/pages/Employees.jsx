import { useState, useRef } from "react";
import AddEmployeeForm from "../components/employee/AddEmployeeForm";
import EmployeesList from "../components/employee/EmployeesList";
import "../assets/styles/Employees.css";

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
      console.log("Odświeżanie listy pracowników po dodaniu");
    }
  };

  return (
    <div className="employees">
      <h1>Lista {import.meta.env.VITE_EMPLOYEE + 'ów'}</h1>
      
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
          Dodaj nowego {import.meta.env.VITE_EMPLOYEE+'a' ||'pracownika'}
        </button>
      )}
      
      <EmployeesList ref={employeesListRef} />
    </div>
  );
}