import React from 'react';

const Filters = ({ visible, genres, onGenreChange, onYearChange, onRatingChange, onSortChange }) => {
    const years = Array.from({ length: 25 }, (_, i) => 2025 - i); // 2000–2025

    return (
        <div className={`filters mb-4 d-flex flex-wrap gap-3 transition-opacity ${visible ? 'filters-visible' : 'filters-hidden'}`}>
            <select onChange={e => onGenreChange(e.target.value)} className="form-select w-auto">
                <option value="">All Genres</option>
                {genres.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                ))}
            </select>

            <select onChange={e => onYearChange(e.target.value)} className="form-select w-auto">
                <option value="">All Years</option>
                {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>

            <select onChange={e => onRatingChange(e.target.value)} className="form-select w-auto">
                <option value="">All Ratings</option>
                {[9, 8, 7, 6, 5].map(r => (
                    <option key={r} value={r}>{r}+</option>
                ))}
            </select>

            <select onChange={e => onSortChange(e.target.value)} className="form-select w-auto">
                <option value="popularity.desc">Most Popular</option>
                <option value="release_date.desc">Newest</option>
                <option value="vote_average.desc">Top Rated</option>
            </select>
        </div>
    );
};

export default Filters;
