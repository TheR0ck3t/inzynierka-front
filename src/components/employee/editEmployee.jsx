import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddRfidCard from '../rfid/AddRfidCard';
import PersonalDataSection from './PersonalDataSection';
import JobDataSection from './JobDataSection';
import RfidCardSection from './RfidCardSection';
import logger from '../../utils/logger';
import '../../assets/styles/EditEmployee.css';

const componentLogger = logger.createChildLogger('editEmployee');

export default function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRfidCard, setShowRfidCard] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position: '',
        department: ''
    });

    // Pobierz dane pracownika
    const fetchEmployee = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/employees/${id}`);
            console.log('Fetched employee data:', response.data);
            if (response.data && response.data.data) {
                const emp = response.data.data;
                setEmployee(emp);
                setFormData({
                    first_name: emp.first_name || emp.firstName || '',
                    last_name: emp.last_name || emp.lastName || '',
                    email: emp.email || '',
                    phone: emp.phone || '',
                    position: emp.job_title || '',
                    department: emp.department_name || ''
                });
            }
        } catch (error) {
            componentLogger.error('Error fetching employee:', error);
            setError('Nie udało się pobrać danych pracownika');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchEmployee();
        }
    }, [id, fetchEmployee]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`/api/employees/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                alert('Dane pracownika zostały zaktualizowane');
                navigate('/employees');
            }
        } catch (error) {
            componentLogger.error('Error updating employee:', error);
            alert('Błąd podczas aktualizacji danych pracownika');
        }
    };

    const handleRfidSuccess = (data) => {
        componentLogger.info('RFID card added:', data);
        setShowRfidCard(false);
        // Odśwież dane pracownika aby pobrać nowy keycard_id
        fetchEmployee();
        alert(`Karta RFID została dodana: ${data.tagId}`);
    };

    const handleRfidCancel = () => {
        setShowRfidCard(false);
    };

    if (loading) {
        return <div className="edit-employee-container">Ładowanie danych pracownika...</div>;
    }

    if (error) {
        return <div className="edit-employee-container error">{error}</div>;
    }

    if (!employee) {
        return <div className="edit-employee-container">Nie znaleziono pracownika</div>;
    }

    return (
        <div className="edit-employee-container">
            <div className="edit-employee-header">
                <h1>Edytuj pracownika</h1>
                <button onClick={() => navigate('/employees')} className="back-btn">
                    ← Powrót do listy
                </button>
            </div>

            {showRfidCard ? (
                <div className="rfid-section">
                    <AddRfidCard 
                        onSuccess={handleRfidSuccess}
                        onCancel={handleRfidCancel}
                        employeeId={id}
                    />
                </div>
            ) : (
                <div className="edit-employee-form">
                    <PersonalDataSection 
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                    
                    <JobDataSection 
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                    
                    <RfidCardSection 
                        employee={employee}
                        setShowRfidCard={setShowRfidCard}
                        fetchEmployee={fetchEmployee}
                    />

                    {/* Przyciski akcji */}
                    <div className="form-actions">
                        <button onClick={handleSave} className="save-btn">
                            Zapisz zmiany
                        </button>
                        <button onClick={() => navigate('/employees')} className="cancel-btn">
                            Anuluj
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}