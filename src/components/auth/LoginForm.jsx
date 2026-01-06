import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import TwoFaModal from './TwoFaModal';
import '../../assets/styles/LoginForm.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Lokalny stan dla 2FA modal
  const [show2FA, setShow2FA] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState(null);

  // Login i loginWith2FA z AuthContext
  const authContext = useAuth();

  
  const { login, loginWith2FA } = authContext;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    e.stopPropagation();
    
    if (!email || !password) {
      setError('Email i hasło są wymagane');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await login({ email, password });

      if (result.success) {
        // Sprawdź czy wymaga zmiany hasła
        if (result.requiresPasswordChange) {
          navigate('/change-password-first-login');
        }
        // Login successful - zostanie przekierowany automatycznie przez Pages.jsx
      } else if (result.requires2FA) {
        setLoginCredentials({ email, password });
        setShow2FA(true);
      } else {
        setError(result.error || 'Nieprawidłowe dane logowania');
      }
    } catch {
      setError('Wystąpił błąd podczas logowania');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FASubmit = async (token2fa) => {
    try {
      const result = await loginWith2FA(loginCredentials, token2fa);
      
      if (result.success) {
        setShow2FA(false);
        navigate('/');
      } else {
        setError(result.error || 'Błąd logowania z 2FA');
      }
    } catch {
      setError('Błąd weryfikacji 2FA');
    }
  };

  const handleClose2FAModal = () => {
    setShow2FA(false);
    setLoginCredentials(null);
    setError('');
  };

  return (
    <>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>
      </div>

      {show2FA && (
        <TwoFaModal 
          isOpen={show2FA} 
          onClose={handleClose2FAModal} 
          onSubmit={handle2FASubmit}
        />
      )}
    </>
  );
}