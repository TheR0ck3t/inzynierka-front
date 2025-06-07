import axios from "axios";

export default function Manage2FA() {
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
            
        }
        else {
        console.error("Błąd podczas dodawania 2FA:", response.data);
    }
    } 
    catch (error) {
        console.error("Błąd podczas dodawania 2FA:", error);
        
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
            
        } else {
            console.error("Błąd podczas usuwania 2FA:", response.data);
        }
    } catch (error) {
        console.error("Błąd podczas usuwania 2FA:", error);
    }
}
    


    return (
        <div className="manage-2fa">
        <h2>Zarządzaj 2FA</h2>
        <p>W tej sekcji możesz zarządzać ustawieniami uwierzytelniania dwuskładnikowego (2FA).</p>
        <button type="button" onClick={handleAdd2FA}>Dodaj 2FA</button>
        <button type="button" onClick={handleRemove2FA}>Usuń 2FA</button>
        <div className="response">
        </div>
        </div>
    );
}