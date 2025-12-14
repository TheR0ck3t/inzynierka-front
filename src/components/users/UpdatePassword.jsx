import React from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import logger from '../../utils/logger';
import '../../assets/styles/UpdatePassword.css';

const componentLogger = logger.createChildLogger('UpdatePassword');

export default function UpdatePassword({ onUpdate }) {
  const { register, handleSubmit, formState: { errors }, setError: setFormError, watch } = useForm();
  const [successMessage, setSuccessMessage] = React.useState('');
  const [apiError, setApiError] = React.useState('');
  
  const newPassword = watch("new_password", "");
  
  // Sprawdzanie warunków hasła
  const passwordValidation = {
    minLength: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasSpecialChar: /[@$!%*?&]/.test(newPassword)
  };

  const onSubmit = async (data) => {
    setApiError('');
    setSuccessMessage('');
    componentLogger.debug("Account update requested:", data);
    
    try {
      const response = await axios.put('/api/accounts/update', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        componentLogger.info("Password updated successfully");
        setSuccessMessage('Hasło zostało zmienione pomyślnie!');
        // Wywołaj onUpdate tylko po sukcesie
        if (onUpdate) {
          onUpdate(response.data);
        }
      }
    } catch (error) {
      componentLogger.error("Password update error:", error);
      
      // Obsługa błędów walidacji z backendu
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        
        // Główny komunikat błędu
        if (errorData.error) {
          setApiError(errorData.error);
        }
        
        // Szczegółowe błędy dla konkretnych pól
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach(err => {
            setFormError(err.field, {
              type: 'server',
              message: err.message
            });
          });
        }
      } else {
        setApiError('Wystąpił błąd podczas zmiany hasła. Spróbuj ponownie.');
      }
    }
  };



  return (
    <div className="update-password-container">
      <h2>Aktualizacja Hasła</h2>
      
      {apiError && <div className="error-message">{apiError}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-section">
          <h3>Zmiana hasła</h3>
          
          <div className="form-group">
            <label htmlFor="currentPassword">Stare hasło:</label>
            <input id="currentPassword" type="password" {...register("current_password", { required: "Stare hasło jest wymagane" })} />
            {errors.current_password && <span className="error">{errors.current_password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nowe hasło:</label>
            <input 
              id="newPassword" 
              type="password" 
              {...register("new_password", { 
                required: "Nowe hasło jest wymagane",
                validate: {
                  allConditions: (value) => {
                    const conditions = [
                      value.length >= 8,
                      /[A-Z]/.test(value),
                      /[a-z]/.test(value),
                      /\d/.test(value),
                      /[@$!%*?&]/.test(value)
                    ];
                    return conditions.every(c => c) || "validation";
                  }
                }
              })} 
            />
            <div className="password-validation">
              {!passwordValidation.minLength && <span className="error">• Minimum 8 znaków</span>}
              {!passwordValidation.hasUpperCase && <span className="error">• Co najmniej jedna wielka litera</span>}
              {!passwordValidation.hasLowerCase && <span className="error">• Co najmniej jedna mała litera</span>}
              {!passwordValidation.hasNumber && <span className="error">• Co najmniej jedna cyfra</span>}
              {!passwordValidation.hasSpecialChar && <span className="error">• Co najmniej jeden znak specjalny (@$!%*?&)</span>}
            </div>
            {errors.new_password && errors.new_password.type !== 'allConditions' && (
              <span className="error">{errors.new_password.message}</span>
            )}
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit">Zmień hasło</button>
        </div>
      </form>
    </div>
  );
}