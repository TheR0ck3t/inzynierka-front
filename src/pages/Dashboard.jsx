import '../assets/styles/Dashboard.css';

export default function Dashboard() {
    return (
        <div className="dashboard">
        <h1>Panel administracyjny</h1>
        <p>Witaj w panelu administracyjnym <b>{import.meta.env.VITE_COMPANY_NAME}</b>!</p>
        <p>Wkrótce tutaj znajdziesz więcej funkcji.</p>

        <p>Obecnie możesz zarządzać pracownikami i przeglądać ich listę.</p>
        <p>Wybierz odpowiednią opcję z menu, aby rozpocząć.</p>

        </div>
    );
    }