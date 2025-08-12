import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import logger from '../../utils/logger';
import '../../assets/styles/UpdatePhoneNumber.css';

const componentLogger = logger.createChildLogger('UpdatePhoneNumber');

export default function UpdatePhoneNumber({ onUpdate }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.put('/api/accounts/update',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      if (response.status === 200) {
        componentLogger.info("Phone number updated successfully:", response.data);
        onUpdate(response.data); // Wywołanie funkcji przekazanej jako props
      } else {
        componentLogger.error("Phone number update failed:", response.data);
      }
    } catch (error) {
      componentLogger.error("Phone number update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="update-phone-container">
      <h2>Aktualizacja Numeru Telefonu</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-section">
          <h3>Zmiana numeru telefonu</h3>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Nowy numer telefonu:</label>
            <input id="phoneNumber" type="tel" {...register("phone_number", { required: "Numer telefonu jest wymagany" })} />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber.message}</span>}
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Aktualizowanie..." : "Zmień numer telefonu"}
          </button>
        </div>
      </form>
    </div>
  );
}