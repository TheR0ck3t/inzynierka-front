import UpdatePassword from "../components/employee/UpdatePassword";
import UpdatePhoneNumber from "../components/employee/UpdatePhoneNumber";
import { useState } from "react";

export default function AccountSettings() {
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [showUpdatePhoneNumber, setShowUpdatePhoneNumber] = useState(false);

  return (
    <div className="account-settings">
      <h1>Ustawienia konta</h1>
      <p>W tej sekcji możesz zarządzać ustawieniami swojego konta.</p>
      <button type="button" onClick={() => {
        setShowUpdatePhoneNumber(true);
        setShowUpdatePassword(false);
      }}>
        Dodatkowe informacje
      </button>
      <button type="button" onClick={() => {
        setShowUpdatePassword(true);
        setShowUpdatePhoneNumber(false);
      }}>
        Zmień hasło
      </button>
      <button type="button">
        Dodaj 2FA
      </button>
      <div className="update">
        {showUpdatePassword && (
          <UpdatePassword onUpdate={() => setShowUpdatePassword(false)} />
        )}
        {showUpdatePhoneNumber && (
          <UpdatePhoneNumber onUpdate={() => setShowUpdatePhoneNumber(false)} />
        )}
      </div>
      {/* Możesz dodać więcej komponentów lub funkcji zarządzających ustawieniami konta */}
      <p>Wkrótce dodamy więcej funkcji!</p>
    </div>
  );
}