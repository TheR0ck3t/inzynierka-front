import LogList from "../components/security/LogList";

export default function Logs() {
    return (
        <div className="logs">
            <h2>Logi systemowe</h2>
            <p>Wkrótce tutaj znajdziesz więcej funkcji.</p>
            <p>Obecnie możesz przeglądać logi systemowe.</p>
            <p>Wybierz odpowiednią opcję z menu, aby rozpocząć.</p>
            <LogList />
        </div>
    );
}