import React, { forwardRef } from 'react';

const Filters = forwardRef(({
                                static: isStatic = false,
                                genres,
                                onGenreChange,
                                onYearChange,
                                onRatingChange,
                                onSortChange,
                                className = ''
                            }, ref) => {
    const years = Array.from({ length: 25 }, (_, i) => 2025 - i);

    return (
        <div ref={ref} className={`filters ${className}`}>
            <select onChange={(e) => onGenreChange(e.target.value)} className="form-select mb-2">
                <option value="">All Genres</option>
                {genres.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                ))}
            </select>
            <select onChange={(e) => onYearChange(e.target.value)} className="form-select mb-2">
                <option value="">All Years</option>
                {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
            <select onChange={(e) => onRatingChange(e.target.value)} className="form-select mb-2">
                <option value="">All Ratings</option>
                {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}+</option>
                ))}
            </select>
            <select onChange={(e) => onSortChange(e.target.value)} className="form-select">
                <option value="popularity.desc">Popularity</option>
                <option value="vote_average.desc">Rating</option>
                <option value="release_date.desc">Latest</option>
            </select>
        </div>
    );
});

export default Filters;
