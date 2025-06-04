import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../assets/styles/LoginForm.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email i hasło są wymagane');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
        console.log('Próba logowania:', { email });
      const success = await login({ email, password });
      console.log('Logowanie zakończone:', success);

      if (success) {
        navigate('/dashboard');
      } else {
        setError('Nieprawidłowe dane logowania');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas logowania');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
        
        {error && <div className="error-message">{error}</div>}
        
        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>
    </div>
  );
}