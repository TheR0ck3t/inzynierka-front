import { useForm } from "react-hook-form";

export default function UpdateAccount({ onUpdate }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Tutaj można dodać logikę aktualizacji konta
    console.log("Aktualizacja konta:", data);
    onUpdate(data); // Wywołanie funkcji przekazanej jako props
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="update-account-form">
      <h2>Aktualizacja konta</h2>
      
      <div className="form-group">
        <label htmlFor="firstName">Imię</label>
        <input 
          id="firstName" 
          {...register("firstName", { required: "Imię jest wymagane" })} 
        />
        {errors.firstName && <span className="error">{errors.firstName.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Nazwisko</label>
        <input 
          id="lastName" 
          {...register("lastName", { required: "Nazwisko jest wymagane" })} 
        />
        {errors.lastName && <span className="error">{errors.lastName.message}</span>}
      </div>

      <button type="submit">Zapisz zmiany</button>
    </form>
  );
}