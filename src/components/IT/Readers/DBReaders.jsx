import { useState, useEffect} from 'react';
import { useDroppable } from '@dnd-kit/core';
import axios from 'axios';
import logger from '../../../utils/logger';

const componentLogger = logger.createChildLogger('DBReaders');

export default function DBReaders({ refreshTrigger = 0 }) {
  const [dbReaders, setDbReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isOver, setNodeRef } = useDroppable({
    id: 'db-readers-dropzone'
  });

  const style = {
    backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : undefined,
    border: isOver ? '2px dashed #00ff00' : '2px solid transparent',
    minHeight: '300px',
    padding: '20px',
    transition: 'all 0.2s ease'
  };

  // Pobierz czytniki przy montowaniu i gdy refreshTrigger się zmieni
  useEffect(() => {
    componentLogger.info('Fetching readers, trigger:', refreshTrigger);
    
    const fetchData = async () => {
      try {
        componentLogger.info('Fetching DB readers...');
        setLoading(true);
        const response = await axios.get('/api/readers/list');
        componentLogger.info('Received response:', response.data);
        if (response.data && Array.isArray(response.data.data)) {
          componentLogger.info(`Found ${response.data.data.length} readers`);
          setDbReaders(response.data.data);
          setError(null);
        }
      } catch (error) {
        componentLogger.error('Error fetching DB readers:', error);
        setError('Błąd podczas pobierania czytników z bazy danych');
      } finally {
        setLoading(false);
        componentLogger.info('Fetch completed');
      }
    };
    
    fetchData();
  }, [refreshTrigger]);

  if (loading) {
    return <div>Ładowanie czytników z bazy danych...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} className="db-readers-list">
      <h3>Czytniki w bazie danych:</h3>
      {dbReaders.length === 0 && (
        <p className="no-readers">Brak czytników w bazie danych. Przeciągnij czytnik z lewej strony.</p>
      )}
      {dbReaders.map((reader) => (
        <div key={reader.device_id} className="reader-card">
          <h4>{reader.reader_name}</h4>
          <p><strong>Device ID:</strong> {reader.device_id || 'N/A'}</p>
        </div>
      ))}
    </div>
  );
}