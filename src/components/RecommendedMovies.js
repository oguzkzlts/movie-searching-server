// RecommendedMovies.js (example)
import React from 'react';
import MovieCard from './MovieCard';

const RecommendedMovies = ({ films }) => {
    return (
        <div className="recommended-movies-grid">
            {films.map(film => (
                <MovieCard key={film.id} film={film} />
            ))}
        </div>
    );
};


export default RecommendedMovies;
