import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import axios from 'axios';
import logger from '../../utils/logger';
import LiveReaders from './Readers/LiveReaders.jsx';
import DBReaders from './Readers/DBReaders.jsx';
import '../../assets/styles/ReadersList.css';

const componentLogger = logger.createChildLogger('ReadersList');

export default function ReadersList() {
  const [activeReader, setActiveReader] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDragStart = (event) => {
    componentLogger.info('Drag started:', event.active.id);
    setActiveReader(event.active.data.current);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    componentLogger.info('Drag ended:', { active: active.id, over: over?.id });
    if (!over || over.id !== 'db-readers-dropzone') {
      setActiveReader(null);
      return;
    }
    // Dane przeciąganego czytnika
    const readerData = active.data.current;
    
    try {
      setIsAdding(true);
      componentLogger.info('Adding reader to database:', readerData);
 
      const response = await axios.post('/api/readers', {
        reader_name: readerData.reader_name,
        device_id: readerData.device_id
      });

      if (response.data.success) {
        componentLogger.info('Reader added successfully:', response.data);
        
        // Wymuś odświeżenie DBReaders przez zmianę triggera
        setRefreshTrigger(prev => {
          const newValue = prev + 1;
          console.log('📈 Incrementing refreshTrigger from', prev, 'to', newValue);
          return newValue;
        });

        // Użyj setTimeout żeby alert nie blokował
        setTimeout(() => {
          alert(`Czytnik ${readerData.reader_name} został dodany do bazy danych!`);
        }, 100);
      }
    } catch (error) {
      componentLogger.error('Error adding reader:', error);
      
      if (error.response?.status === 409) {
        alert('Ten czytnik już istnieje w bazie danych!');
      } else {
        alert('Błąd podczas dodawania czytnika do bazy danych');
      }
    } finally {
      setIsAdding(false);
      setActiveReader(null);
    }
  };

  return (
    <div className="readers-list-container">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="split-screen horizontal">
          <div className="left-pane">
            <LiveReaders />
          </div>
          <div className="right-pane">
            <DBReaders refreshTrigger={refreshTrigger} key={`db-${refreshTrigger}`} />
          </div>
        </div>
        
        <DragOverlay>
          {activeReader ? (
            <div className="reader-card dragging-overlay">
              <h4>{activeReader.reader_name}</h4>
              <p><strong>Status:</strong> {activeReader.status}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      
      {isAdding && (
        <div className="loading-overlay">
          Dodawanie czytnika do bazy danych...
        </div>
      )}
    </div>
  );
}