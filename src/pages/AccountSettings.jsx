import UpdatePassword from "../components/users/UpdatePassword";
import UpdatePhoneNumber from "../components/users/UpdatePhoneNumber";
import Manage2FA from "../components/users/Manage2FA";

import { useState } from "react";

export default function AccountSettings() {
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [showUpdatePhoneNumber, setShowUpdatePhoneNumber] = useState(false);
  const [showManage2FA, setshowManage2FA] = useState(false);

  return (
    <div className="account-settings">
      <h2>Ustawienia konta</h2>
      <p>W tej sekcji możesz zarządzać ustawieniami swojego konta.</p>
      <button type="button" onClick={() => {
        setShowUpdatePhoneNumber(true);
        setShowUpdatePassword(false);
        setshowManage2FA(false);
      }}>
        Dodatkowe informacje
      </button>
      <button type="button" onClick={() => {
        setShowUpdatePassword(true);
        setShowUpdatePhoneNumber(false);
        setshowManage2FA(false);
      }}>
        Zmień hasło
      </button>
      <button type="button" onClick={() => {
        setshowManage2FA(true);
        setShowUpdatePassword(false);
        setShowUpdatePhoneNumber(false);
      }}>
        2FA
      </button>
      <div className="update">
        {showUpdatePassword && (
          <UpdatePassword onUpdate={() => setShowUpdatePassword(false)} />
        )}
        {showUpdatePhoneNumber && (
          <UpdatePhoneNumber onUpdate={() => setShowUpdatePhoneNumber(false)} />
        )}
        {showManage2FA && (
          <Manage2FA onUpdate={() => setshowManage2FA(false)} />
        )}
      </div>
      {/* Możesz dodać więcej komponentów lub funkcji zarządzających ustawieniami konta */}
    </div>
  );
}