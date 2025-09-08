import { useEffect, useState } from 'react';
import axios from 'axios';
import logger from '../../utils/logger';
import {io} from "socket.io-client";
import '../../assets/styles/LogList.css';

const componentLogger = logger.createChildLogger('LogList');

export default function LogList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funkcja pobierająca logi
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/logs/access-logs', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.data && Array.isArray(response.data.data)) {
        setLogs(response.data.data);
      } else if (response.data && !Array.isArray(response.data.data)) {
        setError('Nieprawidłowy format danych');
        componentLogger.error('Nieprawidłowy format danych:', response.data);
      } else {
        setLogs([]);
      }
    } catch (error) {
      setError('Wystąpił błąd podczas ładowania logów.');
      componentLogger.error('Błąd podczas ładowania logów:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const socket = io('/access-logs', { path: '/socket.io' });
    socket.on('connect', () => {
      console.log('Połączono z /access-logs przez Socket.IO');
    });
    // Przykład odbioru nowego loga (event musi być emitowany z backendu, np. 'new-log')
    socket.on('new-log', (newLog) => {
        console.log('Otrzymano nowy log:', newLog);
      setLogs((prevLogs) => [...prevLogs, newLog]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return <div className="employees-list">Ładowanie logów dostępu...</div>;
  }

  if (error) {
    return <div className="employees-list error">{error}</div>;
  }

  if (logs.length === 0) {
    return <div className="log-list">Brak logów do wyświetlenia</div>;
  }

  return (
    <div className="log-list">
      <h2>Logi dostępu</h2>
      {logs.map((log) => (
        <div key={log.access_id} className="log-item" id={log.access_id}>
          <p><strong>Pracownik:</strong> {log.employee_name}</p>
          <p><strong>Data:</strong> {new Date(log.timestamp).toLocaleString()}</p>
          <p><strong>Miejsce:</strong> {log.reader_id}</p>
          <p><strong>Akcja:</strong> {log.action}</p>
          <p><strong>Status:</strong> {log.status}</p>
        </div>
      ))}
    </div>
  );
}