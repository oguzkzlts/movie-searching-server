import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, suggestions }) => {
    const [value, setValue] = useState('');
    const [filteredSug, setFilteredSug] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (value) {
            const list = suggestions
                .filter(film =>
                    film.title.toLowerCase().includes(value.toLowerCase())
                )
                .slice(0, 5);
            setFilteredSug(list);
        } else {
            setFilteredSug([]);
        }
    }, [value, suggestions]);

    const handleChange = (e) => {
        const val = e.target.value;
        setValue(val);
        onSearch(val);
        setShowSuggestions(true);
    };

    const handleSelect = (title) => {
        setValue(title);
        onSearch(title);
        const selectedFilm = suggestions.find(f => f.title === title);
        if (selectedFilm && onSelect) onSelect(selectedFilm);
        setShowSuggestions(false);
    };

    return (
        <div className="search-bar position-relative mb-4" style={{ marginTop: '20px' }}>
            <input
                type="text"
                className="form-control"
                placeholder="Search films..."
                value={value}
                onChange={handleChange}
            />
            {showSuggestions && filteredSug.length > 0 && (
                <ul className="list-group position-absolute w-100" style={{ zIndex: 10 }}>
                    {filteredSug.map(film => (
                        <li
                            key={film.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSelect(film.title)}
                        >
                            {film.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;