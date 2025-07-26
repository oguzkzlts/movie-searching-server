import React from 'react';

const MovieCard = ({ film }) => {
    return (
        <div className="card h-100">
            <img src={film.image} className="card-img-top" alt={film.title} />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{film.title}</h5>
                <p className="card-text text-muted mb-1">
                    {film.director}, {film.year}
                </p>
                <p className="card-text mb-2">{film.genre.join(', ')}</p>
                <p className="card-text fst-italic mb-2">Rating: {film.rating}</p>
                <p className="card-text flex-grow-1">{film.synopsis}</p>
            </div>
        </div>
    );
};

export default MovieCard;