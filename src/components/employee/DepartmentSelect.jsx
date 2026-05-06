import { useState, useEffect } from "react";
import axios from "axios";

export default function DepartmentSelect({ value, onChange, error }) {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/api/departments/list', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setDepartments(response.data.data || []);
            } catch (error) {
                console.error('Błąd podczas pobierania działów:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    return (
        <div className="form-group">
            <label htmlFor="department_id">Dział *</label>
            <select
                id="department_id"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={loading}
                className={error ? 'error' : ''}
            >
                <option value="" hidden>Wybierz dział</option>
                {departments.map(department => (
                    <option key={department.department_id} value={department.department_id}>
                        {department.department_name}
                    </option>
                ))}
            </select>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
}