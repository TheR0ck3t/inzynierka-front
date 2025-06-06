import '../../assets/styles/Footer.css';
export default function Footer() {
  return (
    <footer className="footer">
        <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} {import.meta.env.VITE_COMPANY_NAME || 'Zarządzanie Pracownikami'}. All rights reserved.</p>
        </div>
    </footer>
    );
};