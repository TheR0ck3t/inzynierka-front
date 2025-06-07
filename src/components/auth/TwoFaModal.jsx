import { useState } from 'react';
import '../../assets/styles/TwoFAModal.css'; // Upewnij się, że masz odpowiedni plik CSS

export default function TwoFaModal({ isOpen, onClose, onSubmit }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!code) {
      setError('Kod weryfikacyjny jest wymagany');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(code);
      onClose();
    } catch {
      setError('Wystąpił błąd podczas weryfikacji kodu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Weryfikacja dwuetapowa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Wprowadź 6-cyfrowy kod z aplikacji</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength="6"
              pattern="[0-9]{6}"
              autoComplete="one-time-code"
              autoFocus
              required
              disabled={isSubmitting}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <div className="button-group">
            <button type="submit" disabled={isSubmitting || code.length !== 6}>
              {isSubmitting ? 'Weryfikuję...' : 'Zweryfikuj'}
            </button>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
