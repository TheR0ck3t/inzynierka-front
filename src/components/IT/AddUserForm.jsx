import { useForm } from "react-hook-form";
import { useState } from "react";
import logger from '../../utils/logger';
import axios from "axios";
import EmployeesListSelect from "../employee/EmployeesListSelect";
import '../../assets/styles/AddForm.css'; // Import stylów CSS

const componentLogger = logger.createChildLogger('AddUserForm');


export default function AddUserForm({ onCancel, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  
  const onSubmit = async (data) => {
    componentLogger.debug('Form data:', data);
    setIsSubmitting(true);
    
    
    try {
      const response = await axios.post('/api/accounts/add', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      componentLogger.info('User added successfully:', response.data);
      // Wywołaj funkcję przekazaną przez props, aby powiadomić rodzica o sukcesie
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      componentLogger.error('Error adding user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Nieznany błąd';
      alert('Błąd podczas dodawania użytkownika: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return(
    <div className="add-form-container">
      <h2>Dodaj nowego użytkownika</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-section">
          <h3>Dane użytkownika</h3>
          
          <div className="form-group">
            <EmployeesListSelect
            value={watch('employee_id')}
              id="employee_id"
              onChange={(value) => setValue('employee_id', value)}
              required = "Wybranie pracownika jest wymagane"
            />
            {errors.employee_id && <span className="error">To pole jest wymagane</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">email <span style={{color: 'red'}}>*</span></label>
            <input type="email" name="email" id="email" placeholder="adres@email"{...register('email', { required: "Email jest wymagany" })} />
            {errors.email && <span className="error">To pole jest wymagane</span>}
          </div>
          </div>
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Dodawanie...' : 'Dodaj użytkownika'}
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