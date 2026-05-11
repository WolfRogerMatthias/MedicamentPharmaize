import React, { Component } from 'react';
import Fuse from 'fuse.js';
import SearchBar from './components/SearchBar';
import MedicationList from './components/MedicationList';
import MedicationDetail from './components/MedicationDetail';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medications: [],
      query: '',
      selectedId: null,
      loading: true,
      error: null,
    };
    this.fuse = null;
  }

  componentDidMount() {
    fetch(`${import.meta.env.BASE_URL}medications.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load medications (HTTP ${res.status})`);
        return res.json();
      })
      .then((data) => {
        this.fuse = new Fuse(data, {
          keys: [
            { name: 'name', weight: 3 },
            { name: 'brandNames', weight: 2 },
            { name: 'activeIngredient', weight: 2 },
            { name: 'uses', weight: 2 },
            { name: 'drugClass', weight: 1 },
            { name: 'sideEffects', weight: 0.5 },
            { name: 'contraindications', weight: 0.5 },
          ],
          threshold: 0.4,
          ignoreLocation: true,
          includeScore: true,
        });
        this.setState({ medications: data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err.message, loading: false });
      });
  }

  handleQueryChange = (query) => {
    this.setState({ query });
  };

  handleSelect = (id) => {
    this.setState({ selectedId: id });
  };

  handleBack = () => {
    this.setState({ selectedId: null });
  };

  getResults() {
    const { medications, query } = this.state;
    if (!query.trim()) return medications;
    if (!this.fuse) return [];
    return this.fuse.search(query).map((r) => r.item);
  }

  render() {
    const { loading, error, selectedId, query, medications } = this.state;

    if (loading) {
      return <div className="status">Loading medications...</div>;
    }
    if (error) {
      return <div className="status status-error">Error: {error}</div>;
    }

    if (selectedId) {
      const med = medications.find((m) => m.id === selectedId);
      return <MedicationDetail medication={med} onBack={this.handleBack} />;
    }

    const results = this.getResults();

    return (
      <div className="app">
        <header className="app-header">
          <h1>Medicament Pharmaize</h1>
          <p className="subtitle">
            Search by medication name, brand, active ingredient, or symptom
          </p>
        </header>
        <SearchBar query={query} onChange={this.handleQueryChange} />
        <div className="result-count">
          {results.length} {results.length === 1 ? 'result' : 'results'}
          {query.trim() && ` for "${query}"`}
        </div>
        <MedicationList medications={results} onSelect={this.handleSelect} />
      </div>
    );
  }
}

export default App;
