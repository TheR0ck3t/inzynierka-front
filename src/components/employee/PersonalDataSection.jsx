export default function PersonalDataSection({ formData, handleInputChange }) {
    return (
        <div className="form-section">
            <h3>Dane osobowe</h3>
            
            <div className="form-group">
                <label htmlFor="first_name">Imię:</label>
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="last_name">Nazwisko:</label>
                <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="phone">Telefon:</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}
