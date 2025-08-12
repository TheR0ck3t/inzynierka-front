import axios from 'axios';
import logger from '../../utils/logger';

const componentLogger = logger.createChildLogger('RfidCardSection');

export default function RfidCardSection({ 
    employee, 
    setShowRfidCard, 
    fetchEmployee 
}) {
    
    const removeRfidCard = async () => {
        if (!employee?.keycard_id) return;
        
        if (window.confirm('Czy na pewno chcesz usunąć kartę RFID tego pracownika?')) {
            try {
                await axios.delete(`/api/tags/delete/${employee.keycard_id}`);
                alert('Karta RFID została usunięta');
                fetchEmployee(); // Odśwież dane
            } catch (error) {
                componentLogger.error('Error removing RFID card:', error);
                alert('Błąd podczas usuwania karty RFID');
            }
        }
    };

    return (
        <div className="form-section">
            <h3>Karta RFID</h3>
            
            {employee?.keycard_id ? (
                <div className="current-card">
                    <div className="card-details">
                        <span className="card-label">Obecna karta: </span>
                        <span className="card-id">{employee.keycard_id}</span>
                    </div>
                    <div className="card-actions">
                        <button 
                            onClick={() => setShowRfidCard(true)} 
                            className="change-card-btn"
                        >
                            Zmień kartę
                        </button>
                        <button 
                            onClick={removeRfidCard} 
                            className="remove-card-btn"
                        >
                            Usuń kartę
                        </button>
                    </div>
                </div>
            ) : (
                <div className="no-card">
                    <span className="no-card-text">Brak przypisanej karty RFID</span>
                    <button 
                        onClick={() => setShowRfidCard(true)} 
                        className="add-card-btn"
                    >
                        Dodaj kartę RFID
                    </button>
                </div>
            )}
        </div>
    );
}
