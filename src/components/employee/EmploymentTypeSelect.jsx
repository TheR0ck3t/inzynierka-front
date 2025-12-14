import { useState, useEffect } from "react";
import axios from "axios";

export default function EmploymentTypeSelect({ value, onChange, error }) {
    const [employmentTypes, setEmploymentTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmploymentTypes = async () => {
            try {
                const response = await axios.get('/api/employees/employmentTypes/list', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setEmploymentTypes(response.data.data);
            } catch (error) {
                console.error('Błąd podczas pobierania form zatrudnienia:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchEmploymentTypes();
    }, []);

   return (
        <div className="form-group">
            <label htmlFor="employment_type">Forma zatrudnienia *</label>
            <select
                id="employment_type"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={loading}
                className={error ? 'error' : ''}
            >
                <option value="">Wybierz formę zatrudnienia</option>
                {employmentTypes.map(type => (
                    <option 
                        key={type.employment_type_id} 
                        value={type.employment_type_id}
                        title={type.employment_type_code}
                    >
                        {type.employment_type_name}
                        {type.employment_min_age && ` (min. ${type.employment_min_age} lat)`}
                    </option>
                ))}
            </select>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
}