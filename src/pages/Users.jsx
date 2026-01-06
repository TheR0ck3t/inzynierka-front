import { useState, useRef } from "react";
import logger from '../utils/logger';
import UsersList from "../components/IT/UsersList";
import AddUserForm from "../components/IT/AddUserForm";

const componentLogger = logger.createChildLogger('Users');
export default function Users() {
    const [showAddForm, setShowAddForm] = useState(false);
    const usersListRef = useRef(null);

    const handleUserAdded = () => {
        setShowAddForm(false);
        if (usersListRef.current) {
            usersListRef.current.refreshUsers();
            componentLogger.debug("Refreshing users list after adding new user");
        }
    };

    return (
        <div className="users">
            <h2>Lista Użytkowników</h2>
            {showAddForm ? (
                <AddUserForm 
                    onCancel={() => setShowAddForm(false)}
                    onSuccess={handleUserAdded}
                />
            ) : (
                <button 
                    type="button" 
                    className="add-user-btn" 
                    onClick={() => setShowAddForm(true)}
                >
                    Dodaj nowego użytkownika
                </button>
            )}                     
            <UsersList ref={usersListRef} />
        </div>
    );
}