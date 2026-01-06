import { useState, useEffect } from "react";
import axios from "axios";
import logger from '../../utils/logger';


const componentLogger = logger.createChildLogger('Manage2FA');

export default function Manage2FA() {
    const [ is2FAEnabled, setIs2FAEnabled ] = useState(false);
    const check2FAStatus = async () => {
        try {
            const response = await axios.get('/api/auth/2fa/status', {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setIs2FAEnabled(response.data.status === true);
        } catch (error) {
            componentLogger.error("Error checking 2FA status:", error);
        }
    };
const handleAdd2FA = async () => {

    try {
        const response = await axios.post('/api/auth/2fa/enable', {}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.status === 200) {
            // Możesz tutaj dodać logikę do wyświetlenia QR kodu lub sekretu
            const qrCodeDataUrl = response.data.qrCodeDataUrl;
            // Wyświetl QR kod lub sekret w interfejsie użytkownika
            const qrCodeImage = document.createElement('img');
            qrCodeImage.src = qrCodeDataUrl;
            document.querySelector('.response').appendChild(qrCodeImage);
            // Możesz tutaj dodać logikę do potwierdzenia dodania 2FA
            alert("2FA zostało dodane. Proszę zeskanować kod QR lub zapisać sekret.");
            // Możesz również przekierować użytkownika do innej strony lub zaktualizować stan aplikacji
            setIs2FAEnabled(true);
        }
        else {
        componentLogger.error("Error adding 2FA:", response.data);
    }
    } 
    catch (error) {
        componentLogger.error("Network error adding 2FA:", error);
    }
    };

const handleRemove2FA = async () => {
    try {
        const response = await axios.post('/api/auth/2fa/disable', {}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.status === 200) {
            // Możesz tutaj dodać logikę do potwierdzenia usunięcia 2FA
            alert("2FA zostało usunięte.");
            setIs2FAEnabled(false);
            
        } else {
            componentLogger.error("Error removing 2FA:", response.data);
        }
    } catch (error) {
        componentLogger.error("Network error removing 2FA:", error);
    }
}
    
useEffect(() => {
    check2FAStatus();
}, []);

    return (
        <div className="manage-2fa">
        <h2>Zarządzaj 2FA</h2>
        <p>W tej sekcji możesz zarządzać ustawieniami uwierzytelniania dwuskładnikowego (2FA).</p>
        <p><strong>Status 2FA:</strong> {is2FAEnabled ? 'Włączone' : 'Wyłączone'}</p>
        {!is2FAEnabled ? (
            <button type="button" onClick={handleAdd2FA}>Dodaj 2FA</button>
        ) : (
            <button type="button" onClick={handleRemove2FA}>Usuń 2FA</button>
        )}
        <div className="response">
        </div>
        </div>
    );
}