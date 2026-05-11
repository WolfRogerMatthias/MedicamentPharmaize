import React, { Component } from 'react';

class MedicationDetail extends Component {
  renderList(title, items) {
    if (!items || items.length === 0) return null;
    return (
      <section className="detail-section">
        <h3>{title}</h3>
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>
    );
  }

  renderText(title, text) {
    if (!text) return null;
    return (
      <section className="detail-section">
        <h3>{title}</h3>
        <p>{text}</p>
      </section>
    );
  }

  render() {
    const { medication, onBack } = this.props;
    if (!medication) {
      return (
        <div className="medication-detail">
          <button className="back-button" onClick={onBack}>
            &larr; Back to search
          </button>
          <p className="status">Medication not found.</p>
        </div>
      );
    }

    return (
      <div className="medication-detail">
        <button className="back-button" onClick={onBack}>
          &larr; Back to search
        </button>
        <header className="detail-header">
          <h2>{medication.name}</h2>
          {medication.drugClass && (
            <span className="drug-class-tag">{medication.drugClass}</span>
          )}
        </header>

        {this.renderText('Active ingredient', medication.activeIngredient)}
        {this.renderList('Brand names', medication.brandNames)}
        {this.renderList('Uses', medication.uses)}
        {this.renderText('Dosage', medication.dosage)}
        {this.renderList('Side effects', medication.sideEffects)}
        {this.renderList('Contraindications', medication.contraindications)}
        {this.renderList('Drug interactions', medication.interactions)}
        {this.renderText('Warnings & notes', medication.warnings)}
      </div>
    );
  }
}

export default MedicationDetail;
