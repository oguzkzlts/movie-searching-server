// RecommendedMovies.js (example)
import React from 'react';
import MovieCard from './MovieCard';

const RecommendedMovies = ({ films }) => {
    return (
        <div className="recommended-movies row row-cols-4 row-cols-md-3 g-4">
            {films.map(film => (
                <div key={film.id} className="col">
                    <MovieCard film={film} />
                </div>
            ))}
        </div>
    );
};

export default RecommendedMovies;
