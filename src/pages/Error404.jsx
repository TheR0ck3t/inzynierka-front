import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import '../assets/styles/Error404.css';

export default function Error404() {
    return (
        <div className='error404'>
        <h1>404</h1>
        <p>Nie znaleziono strony</p>
        <p>Przepraszamy, ale strona, której szukasz, nie istnieje.</p>
        <NavLink to={"/"}>
            <button type='button'>
                <FontAwesomeIcon icon={faHouse} /> Wróć do strony głównej
            </button>
            </NavLink>
        </div>
    );
};