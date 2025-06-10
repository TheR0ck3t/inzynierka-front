import { useForm } from "react-hook-form";
import { useState } from "react";
import '../../assets/styles/AddEmployeeForm.css'; // Import stylów CSS

export default function AddEmployeeForm({ onCancel, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    console.log('Form data:', data);
    console.log( typeof data.first_name, typeof data.last_name); 
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/employees/add', {
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
      else {
        console.error('Error:', result);
        alert('Błąd podczas dodawania ' + (import.meta.env.VITE_EMPLOYEE + 'ów' || 'pracowników') + ': ' + (result.message || 'Nieznany błąd'));
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
      <h2>Dodaj nowego {import.meta.env.VITE_EMPLOYEE ||'pracownika'}</h2>
      <form className="add-employee-form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="first_name">
          Imię <span className="required">*</span>
        </label>
        <input
          id="first_name"
          type="text" 
          placeholder="Imię" 
          {...register("first_name", {
            required: "Imię jest wymagane"
          })} 
        />
        {errors.first_name && <p className="error">{errors.first_name.message}</p>}
        
        <label htmlFor="last_name">
          Nazwisko <span className="required">*</span>
        </label>
        <input 
          type="text" 
          placeholder="Nazwisko" 
          {...register("last_name", {
            required: "Nazwisko jest wymagane"
          })} 
        />
        {errors.last_name && <p className="error">{errors.last_name.message}</p>}

        <label htmlFor="dob">
          Data urodzenia <span className="required">*</span>
        </label>
        <input type="date" placeholder="Data urodzenia" 
          {...register("dob", {
            required: "Data urodzenia jest wymagana"
          })}
        />
        {errors.dob && <p className="error">{errors.dob.message}</p>}

        <label htmlFor="employment_date">
          Data zatrudnienia <span className="required">*</span>
        </label>

        <input 
          type="date"
          placeholder="Data zatrudnienia" 
          {...register("employment_date", {
            required: "Data zatrudnienia jest wymagana"
          })}
        />
        {errors.employment_date && <p className="error">{errors.employment_date.message}</p>}
        
        
        <div className="form-buttons">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Dodawanie..." :'Dodaj nowego ' + (import.meta.env.VITE_EMPLOYEE + 'a' ||'pracownika')}
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