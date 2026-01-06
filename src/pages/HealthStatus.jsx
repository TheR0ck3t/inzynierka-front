import { useState, useEffect } from 'react';
import axios from 'axios';
import logger from '../utils/logger';
import '../assets/styles/HealthStatus.css'

const componentLogger = logger.createChildLogger('HealthStatus');

export default function HealthStatus() {
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHealthStatus = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/health', {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.data) {
                setHealthData(response.data);
            } else {
                setHealthData(null);
            }
        } catch (error) {
            componentLogger.error('Error fetching health status:', error);
            setError('Wystąpił błąd podczas pobierania statusu zdrowia systemu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealthStatus();
    }, []);

    if (loading) {
        return <div className="health-status">Ładowanie statusu zdrowia systemu...</div>;
    }

    if (error) {
        return <div className="health-status error">{error}</div>;
    }

    if (!healthData) {
        return <div className="health-status">Brak danych</div>;
    }

    // Wyciągnij dane z odpowiedzi API
    const services = healthData.data || [];
    const apiService = services.find(s => s.service?.api)?.service?.api;
    const dbService = services.find(s => s.service?.db)?.service?.db;
    
    // Funkcja pomocnicza do formatowania uptime
    const formatUptime = (uptimeInSeconds = 0) => ({
        days: Math.floor(uptimeInSeconds / 86400),
        hours: Math.floor((uptimeInSeconds % 86400) / 3600),
        minutes: Math.floor((uptimeInSeconds % 3600) / 60),
        seconds: Math.floor(uptimeInSeconds % 60)
    });

    const apiUptime = formatUptime(apiService?.uptime);
    const dbUptime = formatUptime(dbService?.uptime);

    return (
        <div className="health-status">
            <h2>Status zdrowia systemu</h2>
            
            {/* API Status */}
            {apiService && (
                <div className={`service-status ${apiService.status}`}>
                    <h3>🖥️ API Server</h3>
                    <p><strong>Status:</strong> {apiService.status}</p>
                    <p><strong>Środowisko:</strong> {apiService.environment}</p>
                    <p><strong>Czas działania:</strong> {apiUptime.days} dni, {apiUptime.hours} godzin, {apiUptime.minutes} minut, {apiUptime.seconds} sekund</p>
                    <p><strong>Ostatnia aktualizacja:</strong> {new Date(apiService.timestamp).toLocaleString('pl-PL')}</p>
                </div>
            )}
            
            {/* Database Status */}
            {dbService && (
                <div className={`service-status ${dbService.status}`}>
                    <h3>💾 Baza danych</h3>
                    <p><strong>Status:</strong> {dbService.status}</p>
                    <p><strong>Baza:</strong> {dbService.database?.database || 'N/A'}</p>
                    <p><strong>Czas działania:</strong> {dbUptime.days} dni, {dbUptime.hours} godzin, {dbUptime.minutes} minut, {dbUptime.seconds} sekund</p>
                    <p><strong>Ostatnia aktualizacja:</strong> {new Date(dbService.timestamp).toLocaleString('pl-PL')}</p>
                    {dbService.database?.serverTime && (
                        <p><strong>Czas serwera DB:</strong> {new Date(dbService.database.serverTime).toLocaleString('pl-PL')}</p>
                    )}
                </div>
            )}
        </div>
    );
}       