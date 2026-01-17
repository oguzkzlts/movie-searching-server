import React, { useState, useRef } from 'react';

const MovieCard = ({ film, onFilmSelect }) => {
    const [expanded, setExpanded] = useState(false);
    const synopsisRef = useRef(null);

    const toggleExpanded = () => {
        const newState = !expanded;
        setExpanded(newState);

        if (newState && synopsisRef.current) {
            synopsisRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Helper to trigger the parent function (IMDb redirect)
    const handleLinkClick = () => {
        if (onFilmSelect) {
            onFilmSelect(film);
        }
    };

    return (
        <div className={`movie-card h-100 shadow-sm border-0 ${expanded ? 'expanded' : ''}`}>
            {/* 1. Image Click -> Link */}
            <img
                src={film.image}
                className="card-img-top"
                alt={film.title}
                onClick={handleLinkClick}
                style={{ cursor: 'pointer' }}
            />

            <div className="card-body d-flex flex-column">
                {/* 2. Title Click -> Link */}
                <h5
                    className="card-title clamped"
                    onClick={handleLinkClick}
                    style={{ cursor: 'pointer' }}
                >
                    {film.title}
                </h5>

                <p className="card-text text-muted mb-1">
                    {film.director ? `${film.director}, ` : ''}{film.year}
                </p>
                <p className="card-text mb-2">{film.genre.join(', ')}</p>
                <p className="card-text fst-italic mb-2">
                    {film.rating && film.rating > 0
                        ? `Rating: ${film.rating.toFixed(1)}`
                        : 'No rating'}
                </p>

                <div
                    ref={synopsisRef}
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: expanded ? 'unset' : 3,
                        WebkitBoxOrient: 'vertical',
                        cursor: expanded ? 'default' : 'pointer',
                        transition: 'all 0.3s ease',
                        flexGrow: 1,
                        backgroundColor: expanded ? '#f5f5f5' : 'transparent',
                        padding: expanded ? '0.5rem' : '0',
                        borderRadius: '0.4rem',
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                    }}
                    onClick={toggleExpanded}
                >
                    {film.synopsis}
                </div>

                <button
                    onClick={toggleExpanded}
                    className="btn btn-sm btn-outline-secondary mt-2 align-self-start"
                    style={{fontWeight: 500}}
                >
                    {expanded ? 'Less' : 'More'}
                </button>
            </div>
        </div>
    );
};

export default MovieCard;