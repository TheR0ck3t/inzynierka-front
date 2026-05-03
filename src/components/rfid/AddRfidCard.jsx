import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import useWebSocket from '../../hooks/useWebSocket';
import logger from '../../utils/logger';
import '../../assets/styles/AddRfidCard.css';

const componentLogger = logger.createChildLogger('AddRfidCard');

export default function AddRfidCard({ onSuccess, onCancel, employeeId }) {
    componentLogger.debug('Component mounted', { employeeId });
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [status, setStatus] = useState('');
    const [lastCardUid, setLastCardUid] = useState('');
    const [reader, setReader] = useState('');
    const [availableReaders, setAvailableReaders] = useState([]);
    const [readersLoading, setReadersLoading] = useState(true);
    const hasWsReadersRef = useRef(false);

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

    useEffect(() => {
        const fetchReaders = async () => {
            try {
                if (hasWsReadersRef.current) {
                    return;
                }
                setReadersLoading(true);
                const response = await axios.get('/api/readers/list', { withCredentials: true });
                const readers = Array.isArray(response.data?.data)
                    ? response.data.data.filter((item) => item?.reader_name)
                    : [];

                setAvailableReaders(readers);

                // Ustaw domyślny czytnik z backendu zamiast hardcodowanej wartości
                if (readers.length > 0) {
                    setReader((current) => current || readers[0].reader_name);
                } else {
                    setReader('');
                }
            } catch (error) {
                componentLogger.error('Error fetching readers list', error);
                setAvailableReaders([]);
                setReader('');
                setStatus('❌ Nie udało się pobrać listy czytników');
            } finally {
                setReadersLoading(false);
            }
        };

        // Fallback do API tylko jeśli przez chwilę nie przyszły dane live z WS
        const fallbackTimer = setTimeout(() => {
            fetchReaders();
        }, 4000);

        return () => clearTimeout(fallbackTimer);
    }, []);

    useEffect(() => {
        const readersSocket = io('/readers-list', {
            path: '/socket.io',
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        readersSocket.on('readers_list', (payload) => {
            const readers = Array.isArray(payload?.readers)
                ? payload.readers
                : Array.isArray(payload)
                    ? payload
                    : [];

            const normalizedReaders = readers
                .filter((item) => item?.reader_name && item?.status !== 'offline')
                .map((item) => ({
                    reader_name: item.reader_name,
                    device_id: item.device_id || null
                }));

            hasWsReadersRef.current = true;
            setReadersLoading(false);

            setAvailableReaders(normalizedReaders);
            setReader((current) => {
                const exists = normalizedReaders.some((item) => item.reader_name === current);
                if (exists) return current;
                if (normalizedReaders.length > 0) return normalizedReaders[0].reader_name;
                return '';
            });
        });

        readersSocket.on('connect_error', (error) => {
            componentLogger.warn('Live readers socket connect error', error);
        });

        return () => {
            readersSocket.disconnect();
        };
    }, []);

    const handleStartEnrollment = async () => {
        if (!connected) {
            setStatus('❌ Brak połączenia z serwerem');
            return;
        }

        if (!reader) {
            setStatus('❌ Brak dostępnego czytnika do enrollmentu');
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
                    disabled={isEnrolling || readersLoading || availableReaders.length === 0}
                >
                    {readersLoading && (
                        <option value="">Ładowanie czytników...</option>
                    )}
                    {!readersLoading && availableReaders.length === 0 && (
                        <option value="">Brak dostępnych czytników</option>
                    )}
                    {!readersLoading && availableReaders.map((item) => (
                        <option key={item.device_id || item.reader_name} value={item.reader_name}>
                            {item.reader_name}{item.device_id ? ` (${item.device_id})` : ''}
                        </option>
                    ))}
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
                    disabled={isEnrolling || !connected || readersLoading || !reader}
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
