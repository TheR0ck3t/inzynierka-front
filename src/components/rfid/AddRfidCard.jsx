import { useState, useCallback } from 'react';
import useWebSocket from '../../hooks/useWebSocket';
import logger from '../../utils/logger';
import '../../assets/styles/AddRfidCard.css';

const componentLogger = logger.createChildLogger('AddRfidCard');

export default function AddRfidCard({ onSuccess, onCancel, employeeId }) {
    componentLogger.debug('Component mounted', { employeeId });
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [status, setStatus] = useState('');
    const [lastCardUid, setLastCardUid] = useState('');
    const [reader, setReader] = useState('mainEntrance');

    const handleWebSocketMessage = useCallback((data) => {
        componentLogger.debug('WebSocket message received', data);

        if (data.response === 'TAG_ADDED') {
            setStatus(`✅ Dodano kartę: ${data.uid}`);
            setLastCardUid(data.uid);
            setIsEnrolling(false);
            
            if (onSuccess) {
                onSuccess(data);
            }
        } else if (data.response === 'TAG_EXISTS') {
            setStatus(`⚠️ Karta już istnieje: ${data.uid}`);
            setLastCardUid(data.uid);
            setIsEnrolling(false);
        } else if (data.success !== undefined) {
            // Nowy format z cardEnrolled event
            if (data.success) {
                setStatus(`✅ Karta ${data.tagId} została przypisana do pracownika!`);
                setLastCardUid(data.tagId);
                setIsEnrolling(false);
                
                if (onSuccess) {
                    onSuccess(data);
                }
            } else {
                setStatus(`❌ Błąd: ${data.error}`);
                setIsEnrolling(false);
            }
        } else {
            // Uniwersalna obsługa innych eventów
            componentLogger.warn('Unknown message format', data);
        }
    }, [onSuccess]);

    const { connected } = useWebSocket(handleWebSocketMessage);

    const handleStartEnrollment = async () => {
        if (!connected) {
            setStatus('❌ Brak połączenia z serwerem');
            return;
        }

        setIsEnrolling(true);
        setStatus('🔄 Rozpoczynam enrollment...');
        setLastCardUid('');

        try {
            // Wywołaj REST endpoint
            const response = await fetch('/api/tags/rfid/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    reader,
                    employeeId: employeeId // Dodaj ID pracownika
                })
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('📡 Czekam na przyłożenie karty...');
                // WebSocket nasłuchuje na odpowiedzi
            } else {
                setStatus(`❌ Błąd: ${result.message}`);
                setIsEnrolling(false);
            }
        } catch (error) {
            componentLogger.error('Error starting enrollment', { error: error.message, employeeId, reader });
            setStatus(`❌ Błąd połączenia: ${error.message}`);
            setIsEnrolling(false);
        }
    };

    const handleCancel = () => {
        setIsEnrolling(false);
        setStatus('');
        setLastCardUid('');
        
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="add-rfid-card-container">
            <h2>Dodaj kartę RFID</h2>
            
            <div className="form-group">
                <label htmlFor="reader">Czytnik:</label>
                <select 
                    id="reader" 
                    value={reader} 
                    onChange={(e) => setReader(e.target.value)}
                    disabled={isEnrolling}
                >
                    <option value="mainEntrance">Główne wejście</option>
                    <option value="office">Biuro</option>
                    <option value="lab">Laboratorium</option>
                </select>
            </div>

            <div className="status-container">
                <div className="connection-status">
                    Status: {connected ? '🟢 Połączony' : '🔴 Brak połączenia'}
                </div>
                
                {status && (
                    <div className="enrollment-status">
                        {status}
                    </div>
                )}

                {lastCardUid && (
                    <div className="card-uid">
                        UID karty: <code>{lastCardUid}</code>
                    </div>
                )}
            </div>

            <div className="form-buttons">
                <button 
                    onClick={handleStartEnrollment}
                    disabled={isEnrolling || !connected}
                    className="save-btn"
                >
                    {isEnrolling ? '📡 Czekam na kartę...' : '➕ Dodaj kartę'}
                </button>

                <button 
                    onClick={handleCancel}
                    disabled={false}
                    className="cancel-btn"
                >
                    Anuluj
                </button>
            </div>

            <div className="instructions">
                <h4>Instrukcje:</h4>
                <ol>
                    <li>Wybierz odpowiedni czytnik</li>
                    <li>Kliknij "Dodaj kartę"</li>
                    <li>Przyłóż kartę RFID do czytnika</li>
                    <li>Poczekaj na potwierdzenie</li>
                </ol>
            </div>
        </div>
    );
}
