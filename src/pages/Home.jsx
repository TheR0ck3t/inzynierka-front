import LoginForm from '../components/auth/LoginForm';
import '../assets/styles/Home.css';
import reactLogo from '../assets/react.svg';
import republicLogo from '../assets/Emblem_of_the_Galactic_Republic.svg';

export default function Home() {
  return (
    <div className="home">
      <img src={republicLogo} className="logo" alt="Logo" />
      <h1>Witaj w systemie <b>{import.meta.env.VITE_COMPANY_NAME || 'Zarządzania Pracownikami'}</b></h1>
      <LoginForm />
    </div>
  );
}