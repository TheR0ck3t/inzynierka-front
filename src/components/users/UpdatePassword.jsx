import { useForm } from "react-hook-form";
import axios from "axios";
import logger from '../../utils/logger';
import '../../assets/styles/UpdatePassword.css';

const componentLogger = logger.createChildLogger('UpdatePassword');

export default function UpdatePassword({ onUpdate }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Tutaj można dodać logikę aktualizacji konta
    componentLogger.debug("Account update requested:", data);
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
        componentLogger.info("Account updated successfully:", response.data);
        onUpdate(response.data); // Wywołanie funkcji przekazanej jako props
      } else {
        componentLogger.error("Account update failed:", response.data);
      }
    } catch (error) {
      componentLogger.error("Account update error:", error);
      // Możesz dodać obsługę błędów, np. wyświetlenie komunikatu użytkownikowi
    }
  };



  return (
    <div className="update-password-container">
      <h2>Aktualizacja Hasła</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-section">
          <h3>Zmiana hasła</h3>
          
          <div className="form-group">
            <label htmlFor="currentPassword">Stare hasło:</label>
            <input id="currentPassword" type="password" {...register("current_password", { required: "Stare hasło jest wymagane" })} />
            {errors.currentPassword && <span className="error">{errors.currentPassword.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nowe hasło:</label>
            <input id="newPassword" type="password" {...register("new_password", { required: "Nowe hasło jest wymagane" })} />
            {errors.newPassword && <span className="error">{errors.newPassword.message}</span>}
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit">Zmień hasło</button>
        </div>
      </form>
    </div>
  );
}