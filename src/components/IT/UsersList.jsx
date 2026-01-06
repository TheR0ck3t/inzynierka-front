import {useState, useEffect, forwardRef, useImperativeHandle} from "react";
import {useNavigate} from "react-router-dom";
import logger from '../../utils/logger';
import axios from "axios";
import '../../assets/styles/UsersList.css';

const componentLogger = logger.createChildLogger('UsersList');

const UsersList = forwardRef((props, ref) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/accounts/', {
                headers: {
                    'Content-Type': 'application/json'}
            });
            if (response.data && Array.isArray(response.data.data)) {
                setUsers(response.data.data);
            } else if (response.data && !Array.isArray(response.data.data)) {
                setError("Nieprawidłowy format danych");
                componentLogger.error("Invalid data format:", response.data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            componentLogger.error("Error fetching users:", error);
            setError("Wystąpił błąd podczas pobierania danych");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Expose refreshUsers method to parent via ref
    useImperativeHandle(ref, () => ({
        refreshUsers: fetchUsers
    }));

    if (loading) {
        return <div className="users-list">Ładowanie danych użytkowników...</div>;
    }

    if (error) {
        return <div className="users-list error">{error}</div>;
    }

    const handleSendEmail = (user_id, email) => {
        navigate(`/users/send-email/`, {state: {user_id, email}});
    }

    return (
        <div className="users-list">
            {users.map(user => (
                <div key={user.user_id} className="user" id={user.user_id}>
                    <p>{user.first_name} {user.last_name} - {user.job_title} - {user.department_name}</p>
                    <div className="user-actions">
                        <button onClick={() => navigator.clipboard.writeText(user.email)}>Kopiuj e-mail</button>
                        <button 
                        className="edit-btn"
                        onClick={() => window.location.href = `/users/edit/${user.user_id}`}>Edytuj
                        </button>
                        <button
                        onClick={() => handleSendEmail(user.user_id, user.email)}>Wyślij e-mail</button>

                    </div>
                </div>
            ))}
        </div>
    );
});

UsersList.displayName = 'UsersList';

export default UsersList;