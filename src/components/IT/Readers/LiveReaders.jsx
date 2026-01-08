import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import logger from '../../../utils/logger';
import { useDraggable } from '@dnd-kit/core';

const componentLogger = logger.createChildLogger('LiveReaders');

function DraggableReader({ reader }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: reader.device_id,
    data: reader
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab'
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="reader-card draggable"
    >
      <h4>{reader.reader_name} ({reader.device_id})</h4>
      <p><strong>Status:</strong> {reader.status}</p>
      <p><strong>Ostatnio widziany:</strong> {new Date(reader.last_seen).toLocaleString()}</p>
      {reader.scan_count > 0 && (
        <p><strong>Liczba skanów:</strong> {reader.scan_count}</p>
      )}
    </div>
  );
}

export default function LiveReaders() {
  const [liveReaders, setLiveReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io('/readers-list', { 
      path: '/socket.io',
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      timeout: 20000,
      transports: ['websocket', 'polling']
    });
    setLoading(true);
    
    // Timeout 5 sekund - jeśli brak danych, zakończ ładowanie
    const timeoutId = setTimeout(() => {
      setLoading(false);
      if (liveReaders.length === 0) {
        componentLogger.warn('No readers received within timeout');
      }
    }, 5000);
    
    socket.on('connect', () => {
      componentLogger.info('Connected to /readers-list WebSocket');
      setError(null);
    });
    
    socket.on('reconnect', (attemptNumber) => {
      componentLogger.info(`Reconnected to /readers-list after ${attemptNumber} attempts`);
      setError(null);
    });
    
    socket.on('reconnect_attempt', (attemptNumber) => {
      componentLogger.warn(`Attempting to reconnect... (attempt ${attemptNumber})`);
    });
    
    socket.on('reconnect_error', (error) => {
      componentLogger.error('Reconnection error:', error);
    });
    
    socket.on('reconnect_failed', () => {
      componentLogger.error('Failed to reconnect after all attempts');
      setError('Nie można połączyć się z serwerem');
    });
    
    socket.on('readers_list', (data) => {
      componentLogger.info('Received readers_list update:', data);
      clearTimeout(timeoutId);
      if (data && data.readers && Array.isArray(data.readers)) {
        setLiveReaders(data.readers);
        setLoading(false);
        setError(null);
      } else if (data && Array.isArray(data)) {
        setLiveReaders(data);
        setLoading(false);
        setError(null);
      } else {
        componentLogger.warn('Nieprawidłowy format danych z WebSocket:', data);
        setError('Nieprawidłowy format danych czytników');
        setLoading(false);
      }
    });
    
    socket.on('readers_status_changed', (data) => {
      componentLogger.warn('Received readers_status_changed:', data);
      if (data && data.changes && Array.isArray(data.changes)) {
        data.changes.forEach(change => {
          componentLogger.warn(
            `Czytnik ${change.reader_name} (${change.device_id}): ` +
            `${change.old_status} -> ${change.new_status}`
          );
        });
      }
    });
    
    socket.on('disconnect', () => {
      componentLogger.info('Disconnected from /readers-list WebSocket');
    });
    
    socket.on('connect_error', (error) => {
      componentLogger.error('WebSocket connection error:', error);
      setError('Błąd połączenia z serwerem');
      setLoading(false);
    });
    
    return () => {
      clearTimeout(timeoutId);
      socket.disconnect();
    };
  }, [liveReaders]);

  if (loading) {
    return <div>Ładowanie dostępnych czytników...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const onlineReaders = liveReaders.filter(reader => reader.status === 'online');

  return (
    <div className="readers-list">
      <h3>Czytniki dostępne w sieci:</h3>
      {onlineReaders.length === 0 && (
        <p className="no-readers">Brak aktywnych czytników w sieci</p>
      )}
      {onlineReaders.map((reader) => (
        <DraggableReader key={reader.device_id} reader={reader} />
      ))}
    </div>
  );
}