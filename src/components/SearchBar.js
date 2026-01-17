import React, { useState, useMemo, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch, suggestions, onFilmSelect }) => {
    const [value, setValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Ref to detect clicks outside the component
    const searchRef = useRef(null);

    // OPTIMIZATION: Filter immediately using useMemo.
    // This avoids the double-render caused by useEffect.
    const filteredSug = useMemo(() => {
        if (!value) return [];
        return suggestions
            .filter(film => film.title.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 5);
    }, [value, suggestions]);

    // UX: Handle clicks outside to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setValue(val);
        onSearch(val);
        setShowSuggestions(true);
    };

    const handleSelect = (film) => {
        setValue(film.title);
        setShowSuggestions(false);

        // This triggers the parent to fetch details/open IMDb
        if (onFilmSelect) {
            onFilmSelect(film);
        }
    };

    return (
        <div
            ref={searchRef}
            className="search-bar position-relative mb-4"
            style={{ marginTop: '20px' }}
        >
            <input
                type="text"
                className="form-control"
                placeholder="Search films..."
                value={value}
                onChange={handleChange}
                // UX: Re-open suggestions if user clicks back into the input
                onFocus={() => { if(value) setShowSuggestions(true); }}
            />

            {showSuggestions && filteredSug.length > 0 && (
                <ul
                    className="list-group position-absolute w-100"
                    style={{ zIndex: 1000, cursor: 'pointer' }}
                >
                    {filteredSug.map(film => (
                        <li
                            key={film.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSelect(film)}
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