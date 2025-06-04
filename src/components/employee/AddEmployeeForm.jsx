import { useForm } from "react-hook-form";
import { useState } from "react";
import '../../assets/styles/AddEmployeeForm.css'; // Import stylów CSS

export default function AddEmployeeForm({ onCancel, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  
  const onSubmit = async (data) => {
    console.log('Form data:', data);
    console.log( typeof data.email, typeof data.firstName, typeof data.lastName); 
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/accounts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('Success:', result);
        // Wywołaj funkcję przekazaną przez props, aby powiadomić rodzica o sukcesie
        if (onSuccess) {
          onSuccess();
        }
      }
      else if(result.error === 'userAlreadyExists') {
        console.error('Error:', result);
        setError('email', { type: 'manual', message: result.message });
      }
      else {
        console.error('Error:', result);
        alert('Błąd podczas dodawania pracownika: ' + (result.message || 'Nieznany błąd'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Błąd połączenia: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return(
    <div className="add-employee-container">
      <h2>Dodaj nowego pracownika</h2>
      <form className="add-employee-form" onSubmit={handleSubmit(onSubmit)}>
        <input 
          type="text" 
          placeholder="Imię" 
          {...register("firstName", {
            required: "Imię jest wymagane"
          })} 
        />
        {errors.firstName && <p className="error">{errors.firstName.message}</p>}
        
        <input 
          type="text" 
          placeholder="Nazwisko" 
          {...register("lastName", {
            required: "Nazwisko jest wymagane"
          })} 
        />
        {errors.lastName && <p className="error">{errors.lastName.message}</p>}
        
        <input type="email" placeholder="Email" {...register("email", {required: "Email jest wymagany",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Nieprawidłowy format adresu email"
            }
          })} 
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
        
        <div className="form-buttons">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Dodawanie..." : "Dodaj pracownika"}
          </button>
          
          {onCancel && (
            <button type="button" onClick={onCancel} disabled={isSubmitting}>
              Anuluj
            </button>
          )}
        </div>
      </form>
    </div>
  );
}