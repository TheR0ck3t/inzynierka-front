import { useState, useEffect } from "react";
import axios from "axios";

export default function EmployeesListSelect({ value, onChange, error }) {
    const [employee, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/api/employees/list?departments=true', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setEmployees(response.data.data);
            } catch (error) {
                console.error('Błąd podczas pobierania pracowników:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

   return (
        <div className="form-group">
            <label htmlFor="employees_list">Wybierz pracownika *</label>
            <select
                id="employees_list"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={loading}
                className={error ? 'error' : ''}
            >
                <option hidden value="">Wybierz pracownika</option>
                {employee.map(type => (
                    <option 
                        key={type.employee_id} 
                        value={type.employee_id}
                    >
                        {type.first_name} {type.last_name} - {type.department_name}
                    </option>
                ))}
            </select>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
}