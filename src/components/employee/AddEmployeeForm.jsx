import { useForm } from "react-hook-form";
import { useState } from "react";
import logger from '../../utils/logger';
import axios from "axios";
import '../../assets/styles/AddForm.css'; // Import stylów CSS
import EmploymentTypeSelect from "./EmploymentTypeSelect";

const componentLogger = logger.createChildLogger('AddEmployeeForm');

export default function AddEmployeeForm({ onCancel, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  
  const onSubmit = async (data) => {
    componentLogger.debug('Form data:', data);
    componentLogger.debug('Data types:', typeof data.first_name, typeof data.last_name); 
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/employees/add', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      componentLogger.info('Employee added successfully:', response.data);
      // Wywołaj funkcję przekazaną przez props, aby powiadomić rodzica o sukcesie
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      componentLogger.error('Error adding employee:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Nieznany błąd';
      alert('Błąd podczas dodawania ' + (import.meta.env.VITE_EMPLOYEE + 'ów' || 'pracowników') + ': ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return(
    <div className="add-form-container">
      <h2>Dodaj nowego {import.meta.env.VITE_EMPLOYEE ||'pracownika'}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-section">
          <h3>Dane osobowe</h3>
          
          <div className="form-group">
            <label htmlFor="first_name">Imię <span style={{color: 'red'}}>*</span></label>
            <input
              id="first_name"
              type="text" 
              placeholder="Imię" 
              {...register("first_name", {
                required: "Imię jest wymagane"
              })} 
            />
            {errors.first_name && <p className="error">{errors.first_name.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="last_name">Nazwisko <span style={{color: 'red'}}>*</span></label>
            <input 
              id="last_name"
              type="text" 
              placeholder="Nazwisko" 
              {...register("last_name", {
                required: "Nazwisko jest wymagane"
              })} 
            />
            {errors.last_name && <p className="error">{errors.last_name.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="dob">Data urodzenia <span style={{color: 'red'}}>*</span></label>
            <input 
              id="dob"
              type="date" 
              placeholder="Data urodzenia" 
              {...register("dob", {
                required: "Data urodzenia jest wymagana"
              })}
            />
            {errors.dob && <p className="error">{errors.dob.message}</p>}
          </div>
        </div>

        <div className="form-section">
          <h3>Dane zawodowe</h3>
          
          <div className="form-group">
            <label htmlFor="employment_date">Data zatrudnienia <span style={{color: 'red'}}>*</span></label>
            <input 
              id="employment_date"
              type="date"
              placeholder="Data zatrudnienia" 
              {...register("employment_date", {
                required: "Data zatrudnienia jest wymagana"
              })}
            />
            {errors.employment_date && <p className="error">{errors.employment_date.message}</p>}
          </div>
          
          <EmploymentTypeSelect
            value={watch('employment_type_id') || ''}
            onChange={(value) => setValue('employment_type_id', value)}
            error={errors.employment_type_id}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Dodawanie..." : "Dodaj nowego pracownika"}
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