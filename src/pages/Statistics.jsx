import WorkStats from "../components/statistics/workStats";

export default function Statistics() {
    return (
        <div className="statistics">
            <h1>Statystyki</h1>
            <WorkStats />
            <p>Wkrótce tutaj znajdziesz więcej funkcji.</p>
            <p>Obecnie możesz przeglądać statystyki dotyczące pracowników.</p>
            <p>Wybierz odpowiednią opcję z menu, aby rozpocząć.</p>
        </div>
    );
}