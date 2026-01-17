import React from 'react';
import MovieCard from './MovieCard';

const RecommendedMovies = ({ films, onFilmSelect }) => {
    return (
        <div className="recommended-movies-grid">
            {films.map(film => (
                <MovieCard
                    key={film.id}
                    film={film}
                    onFilmSelect={onFilmSelect}
                />
            ))}
        </div>
    );
};

export default RecommendedMovies;