import EmploymentTypeSelect from './EmploymentTypeSelect';

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
            
            <div className="form-group">
                <label htmlFor="department">Dział:</label>
                <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                />
            </div>
            <EmploymentTypeSelect
                value={formData.employment_type_id || ''}
                onChange={(value) => handleInputChange({ target: { name: 'employment_type_id', value }})}
                error={formData.errors?.employment_type_id}
            />
        </div>
    );
}
