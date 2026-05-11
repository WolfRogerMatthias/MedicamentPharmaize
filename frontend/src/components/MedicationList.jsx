import React, { Component } from 'react';

class MedicationList extends Component {
  render() {
    const { medications, onSelect } = this.props;

    if (medications.length === 0) {
      return (
        <div className="empty">
          No medications match your search. Try a different term.
        </div>
      );
    }

    return (
      <ul className="medication-list">
        {medications.map((med) => (
          <li
            key={med.id}
            className="medication-card"
            onClick={() => onSelect(med.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(med.id);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="card-header">
              <h3>{med.name}</h3>
              {med.drugClass && (
                <span className="drug-class">{med.drugClass}</span>
              )}
            </div>
            {med.brandNames && med.brandNames.length > 0 && (
              <div className="brand-names">
                <span className="label">Brand names:</span>{' '}
                {med.brandNames.join(', ')}
              </div>
            )}
            {med.uses && med.uses.length > 0 && (
              <div className="uses">
                <span className="label">Uses:</span>{' '}
                {med.uses.slice(0, 3).join(', ')}
                {med.uses.length > 3 && ', ...'}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }
}

export default MedicationList;
