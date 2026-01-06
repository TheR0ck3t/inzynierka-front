import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logger from '../utils/logger';
import '../assets/styles/ChangePassword.css';

const componentLogger = logger.createChildLogger('FirstLoginPasswordChange');

export default function FirstLoginPasswordChange() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&#]/.test(password)
    };
    
    return requirements;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Walidacja po stronie klienta
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Obecne hasło jest wymagane';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Nowe hasło jest wymagane';
    } else {
      const requirements = validatePassword(formData.newPassword);
      if (!Object.values(requirements).every(Boolean)) {
        newErrors.newPassword = 'Hasło nie spełnia wymagań';
      }
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await axios.post('/api/auth/change-password', formData);
      
      componentLogger.info('Password changed successfully on first login');
      
      // Przekieruj do dashboard
      navigate('/', { 
        state: { message: 'Hasło zostało pomyślnie zmienione!' }
      });
      
    } catch (error) {
      componentLogger.error('Error changing password:', error);
      
      const errorMessage = error.response?.data?.message || 'Nie udało się zmienić hasła';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordRequirements = formData.newPassword ? validatePassword(formData.newPassword) : null;

  return (
    <div className="change-password-container">
      <div className="change-password-box">
        <h1>Pierwsze logowanie</h1>
        <p className="info-text">
          Ze względów bezpieczeństwa musisz zmienić hasło tymczasowe na własne.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Hasło tymczasowe</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              >
                {showPasswords.current ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.currentPassword && <span className="error">{errors.currentPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nowe hasło</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              >
                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.newPassword && <span className="error">{errors.newPassword}</span>}
            
            {passwordRequirements && (
              <ul className="password-requirements">
                <li className={passwordRequirements.length ? 'valid' : 'invalid'}>
                  Co najmniej 8 znaków
                </li>
                <li className={passwordRequirements.uppercase ? 'valid' : 'invalid'}>
                  Wielka litera (A-Z)
                </li>
                <li className={passwordRequirements.lowercase ? 'valid' : 'invalid'}>
                  Mała litera (a-z)
                </li>
                <li className={passwordRequirements.number ? 'valid' : 'invalid'}>
                  Cyfra (0-9)
                </li>
                <li className={passwordRequirements.special ? 'valid' : 'invalid'}>
                  Znak specjalny (@$!%*?&#)
                </li>
              </ul>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Potwierdź nowe hasło</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              >
                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          {errors.submit && <div className="error submit-error">{errors.submit}</div>}

          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? 'Zmieniam hasło...' : 'Zmień hasło'}
          </button>
        </form>
      </div>
    </div>
  );
}
