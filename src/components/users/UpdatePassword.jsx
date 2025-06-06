import { useForm } from "react-hook-form";
import axios from "axios";

export default function UpdatePassword({ onUpdate }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Tutaj można dodać logikę aktualizacji konta
    console.log("Aktualizacja konta:", data);
    onUpdate(data); // Wywołanie funkcji przekazanej jako props
    try {
      const response = await axios.put('/api/accounts/update',
        data, 
        {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {
        console.log("Konto zaktualizowane pomyślnie:", response.data);
        onUpdate(response.data); // Wywołanie funkcji przekazanej jako props
      } else {
        console.error("Błąd podczas aktualizacji konta:", response.data);
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji konta:", error);
      // Możesz dodać obsługę błędów, np. wyświetlenie komunikatu użytkownikowi
    }
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="update-account-form">
      <h2>Aktualizacja Hasła</h2>
      
      <div className="form-group">
        <label htmlFor="currentPassword">Stare hasło:</label>
        <input id="currentPassword" type="password" {...register("current_password", { required: "Imię jest wymagane" })} />
        {errors.currentPassword && <span className="error">{errors.currentPassword.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="newPassword">Nowe hasło</label>
        <input id="newPassword" type="password" {...register("new_password", { required: "Nazwisko jest wymagane" })} />
        {errors.newPassword && <span className="error">{errors.newPassword.message}</span>}
      </div>

      <button type="submit">Zmień hasło</button>
    </form>
  );
}