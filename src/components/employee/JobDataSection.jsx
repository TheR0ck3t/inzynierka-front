export default function JobDataSection({ formData, handleInputChange }) {
    return (
        <div className="form-section">
            <h3>Dane zawodowe</h3>
            
            <div className="form-group">
                <label htmlFor="position">Stanowisko:</label>
                <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}
