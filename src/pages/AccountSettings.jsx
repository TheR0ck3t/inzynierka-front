import UpdateAccount from "../components/employee/UpdateAccount";

export default function AccountSettings() {




  return (
    <div className="account-settings">
      <h1>Ustawienia konta</h1>
      <p>W tej sekcji możesz zarządzać ustawieniami swojego konta.</p>
      <UpdateAccount onUpdate={(data) => console.log("Dane konta zaktualizowane:", data)} />
      {/* Możesz dodać więcej komponentów lub funkcji zarządzających ustawieniami konta */}
      <p>Wkrótce dodamy więcej funkcji!</p>
    </div>
  );
}