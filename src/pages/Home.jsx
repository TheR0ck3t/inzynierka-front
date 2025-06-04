import LoginForm from '../components/auth/LoginForm';
import '../assets/styles/Home.css';
import reactLogo from '../assets/react.svg';

export default function Home() {
  return (
    <div className="home">
      <img src={reactLogo} className="logo" alt="Vite logo" />
      <h1>Witaj w systemie {import.meta.env.VITE_COMPANY_NAME || 'Zarządzania Pracownikami'}</h1>
      <LoginForm />
    </div>
  );
}