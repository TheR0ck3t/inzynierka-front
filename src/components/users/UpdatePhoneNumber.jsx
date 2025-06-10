import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

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
        console.log("Numer telefonu zaktualizowany pomyślnie:", response.data);
        onUpdate(response.data); // Wywołanie funkcji przekazanej jako props
      } else {
        console.error("Błąd podczas aktualizacji numeru telefonu:", response.data);
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji numeru telefonu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="update-phone-form">
      <h2>Aktualizacja Numeru Telefonu</h2>
      
      <div className="form-group">
        <label htmlFor="phoneNumber">Nowy numer telefonu:</label>
        <input id="phoneNumber" type="tel" {...register("phone_number", { required: "Numer telefonu jest wymagany" })} />
        {errors.phoneNumber && <span className="error">{errors.phoneNumber.message}</span>}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Aktualizowanie..." : "Zmień numer telefonu"}
      </button>
    </form>
  );
}