import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import '../assets/styles/Home.css';
import republicLogo from '../assets/Emblem_of_the_Galactic_Republic.svg';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [verificationMessage, setVerificationMessage] = useState(null);

  useEffect(() => {
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');

    if (verified === 'true') {
      setVerificationMessage({ type: 'success', text: 'Email został zweryfikowany! Możesz się teraz zalogować.' });
      // Usuń parametry z URL po 5 sekundach
      setTimeout(() => {
        searchParams.delete('verified');
        setSearchParams(searchParams);
        setVerificationMessage(null);
      }, 5000);
    } else if (verified === 'false') {
      setVerificationMessage({ type: 'error', text: `Błąd weryfikacji: ${error || 'Nieprawidłowy token'}` });
      setTimeout(() => {
        searchParams.delete('verified');
        searchParams.delete('error');
        setSearchParams(searchParams);
        setVerificationMessage(null);
      }, 5000);
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="home">
      <img src={republicLogo} className="logo" alt="Logo" />
      <h1>Witaj w systemie <b>Zarządzania Pracownikami</b></h1>
      
      {verificationMessage && (
        <div className={`verification-message ${verificationMessage.type}`} style={{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '5px',
          backgroundColor: verificationMessage.type === 'success' ? '#d4edda' : '#f8d7da',
          color: verificationMessage.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${verificationMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {verificationMessage.text}
        </div>
      )}
      
      <LoginForm />
    </div>
  );
}