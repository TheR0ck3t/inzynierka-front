import '../assets/styles/Dashboard.css';

export default function Dashboard() {
    return (
        <div className="dashboard">
        <h2>Witaj w systemie <b>{import.meta.env.VITE_COMPANY_NAME}</b>!</h2>
        </div>
    );
    }