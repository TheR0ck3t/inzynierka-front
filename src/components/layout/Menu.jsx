import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../assets/styles/Menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse,
  faChevronDown, 
  faCog, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import republicLogo from '../../assets/Emblem_of_the_Galactic_Republic.svg';



export default function Menu() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Zamykanie dropdown po kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="menu-container">
      {/* Logo lub element po lewej (opcjonalnie) */}
      <div className="menu-logo">
        <NavLink to="/">
          <img src={republicLogo} alt="Logo" className="logo-small"/>

        </NavLink>
      </div>
      
      {/* Linki nawigacyjne na środku */}
      <div className="menu-center">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <button type="button">
            <FontAwesomeIcon icon={faHouse} />
          </button>
        </NavLink>

        {/* Dostępne dla IT i HR */}
        {(user?.department_name === 'IT' || user?.department_name === 'HR') && (
          <NavLink to="/employees" className={({ isActive }) => isActive ? 'active' : ''}>
            <button type="button">Pracownicy</button>
          </NavLink>
        )}
        
        {/* Dostępne tylko dla HR */}
        {user?.department_name === 'HR' && (
          <NavLink to="/statistics" className={({ isActive }) => isActive ? 'active' : ''}>
            <button type="button">Statystyki</button>
          </NavLink>
        )}

        {/* Dostępne tylko dla IT */}
        {user?.department_name === 'IT' && (
          <>
            <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
              <button type="button">Użytkownicy</button>
            </NavLink>
            
            <NavLink to="/Status" className={({ isActive }) => isActive ? 'active' : ''}>
              <button type="button">Status Systemu</button>
            </NavLink>

            <NavLink to="/logs" className={({ isActive }) => isActive ? 'active' : ''}>
              <button type="button">Logi</button>
            </NavLink>
          </>
        )}
      </div>
      
      {/* Dropdown użytkownika po prawej */}
      {user && (
        <div className="menu-right" ref={dropdownRef}>
          <button 
            className="user-dropdown-toggle" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="user-name">
              {user.first_name || "Imię"} {user.last_name || "Nazwisko"} - {user.department_name || "Dział"}
            </span>
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
            />
          </button>
          
          {dropdownOpen && (
            <div className="user-dropdown">
              <Link to="/account-settings" className="dropdown-item">
                <button type="button">
                  <FontAwesomeIcon icon={faCog} />
                  <span>Ustawienia konta</span>
                </button>
              </Link>
              <button onClick={logout} className="dropdown-item">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Wyloguj</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}