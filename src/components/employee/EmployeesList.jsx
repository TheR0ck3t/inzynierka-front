import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logger from '../../utils/logger';
import '../../assets/styles/EmployeesList.css';

const componentLogger = logger.createChildLogger('EmployeesList');

// Używamy forwardRef, aby przekazać referencję z komponentu nadrzędnego
const EmployeesList = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funkcja do pobierania danych pracowników
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/employees/list', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Sprawdź, czy mamy poprawne dane
      if (response.data && Array.isArray(response.data.data)) {
        setEmployees(response.data.data);
      } else if (response.data && !Array.isArray(response.data.data)) {
        setError("Nieprawidłowy format danych");
        componentLogger.error("Invalid data format:", response.data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      componentLogger.error("Error fetching employees:", error);
      setError("Wystąpił błąd podczas pobierania danych");
    } finally {
      setLoading(false);
    }
  };

  // Wywołaj funkcję pobierającą dane przy montowaniu komponentu
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Eksponuj metodę refreshEmployees dla komponentu nadrzędnego
  useImperativeHandle(ref, () => ({
    refreshEmployees: fetchEmployees
  }));

  // Renderowanie podczas ładowania
  if (loading) {
    return <div className="employees-list">Ładowanie danych {import.meta.env.EMPLOYEE+'ów' ||'pracowników'}...</div>;
  }

  // Renderowanie w przypadku błędu
  if (error) {
    return <div className="employees-list error">{error}</div>;
  }

  // Renderowanie gdy brak pracowników
  if (employees.length === 0) {
    return <div className="employees-list">Brak {import.meta.env.EMPLOYEE+'ów' ||'pracowników'} do wyświetlenia</div>;
  }
  
  async function deleteEmployee(id) {
    try {
      const response = await axios.delete(`/api/employees/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      componentLogger.info("Employee deleted:", response.data);
      // Odśwież listę pracowników po usunięciu
      fetchEmployees();
    } catch (error) {
      componentLogger.error("Error deleting employee:", error);
    }
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/employees/update/${employeeId}`);
  };

  // Renderowanie listy pracowników
  return (
    <div className="employees-list">
        {employees.map(employee => (
          <div className="employee" key={employee.employee_id} id={employee.employee_id}> 
            <p>
              {employee.firstName || employee.first_name} {employee.lastName || employee.last_name} (ID Karty: {employee.keycard_id ? employee.keycard_id : <span className="error">Brak</span> }  )
            </p>
            <div className="employee-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEditEmployee(employee.employee_id)}
              >
                Edytuj
              </button>
              <button className="delete-btn" onClick={()=>deleteEmployee(employee.employee_id)}>Usuń</button>
            </div>
          </div>
        ))}
    </div>
  );
});

// Dodaj nazwę wyświetlaną dla komponentu (pomaga w debugowaniu)
EmployeesList.displayName = 'EmployeesList';

export default EmployeesList;

