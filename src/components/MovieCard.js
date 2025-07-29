import React, { useState, useRef } from 'react';

const MovieCard = ({ film }) => {
    const [expanded, setExpanded] = useState(false);
    const synopsisRef = useRef(null);

    const toggleExpanded = () => {
        const newState = !expanded;
        setExpanded(newState);

        if (newState && synopsisRef.current) {
            synopsisRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="card h-100 shadow-sm border-0">
            <img src={film.image} className="card-img-top" alt={film.title} />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{film.title}</h5>
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
                    aria-expanded={expanded}
                    role="region"
                    aria-label={`Synopsis for ${film.title}`}
                >
                    {film.synopsis}
                </div>

                <button
                    onClick={toggleExpanded}
                    className="btn btn-sm btn-outline-secondary mt-2 align-self-start"
                    style={{fontWeight: 500}}
                    aria-label={expanded ? `Collapse synopsis for ${film.title}` : `Read more about ${film.title}`}
                >
                    {expanded ? 'Less' : 'More'}
                </button>
            </div>
        </div>
    );
};

export default MovieCard;
