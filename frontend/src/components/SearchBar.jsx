import React, { Component } from 'react';

class SearchBar extends Component {
  handleChange = (e) => {
    this.props.onChange(e.target.value);
  };

  handleClear = () => {
    this.props.onChange('');
  };

  render() {
    const { query } = this.props;
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Try 'headache', 'ibuprofen', 'Ventolin', 'NSAID'..."
          value={query}
          onChange={this.handleChange}
          autoFocus
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={this.handleClear}
            aria-label="Clear search"
          >
            x
          </button>
        )}
      </div>
    );
  }
}

export default SearchBar;
