import React, { useState, useRef } from 'react';

const MovieCard = ({ film }) => {
    const [expanded, setExpanded] = useState(false);
    const synopsisRef = useRef(null);

    const handleMoreClick = () => {
        setExpanded(true);
        // Scroll into view smoothly and focus synopsis container
        if (synopsisRef.current) {
            synopsisRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            synopsisRef.current.focus();
        }
    };

    const handleMouseLeave = () => {
        setExpanded(false);
    };

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

                <div
                    ref={synopsisRef}
                    tabIndex={-1}
                    onMouseLeave={expanded ? handleMouseLeave : undefined}
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: expanded ? 'none' : 3,
                        WebkitBoxOrient: 'vertical',
                        cursor: expanded ? 'default' : 'pointer',
                        outline: expanded ? '2px solid #007bff' : 'none',
                        transition: 'all 0.3s ease',
                        flexGrow: 1,
                    }}
                    onClick={() => !expanded && handleMoreClick()}
                    aria-expanded={expanded}
                    role="region"
                    aria-label={`Synopsis for ${film.title}`}
                >
                    {film.synopsis}
                </div>

                {!expanded && (
                    <button
                        onClick={handleMoreClick}
                        className="btn btn-link p-0 mt-2"
                        style={{ alignSelf: 'flex-start' }}
                        aria-label={`Read more about ${film.title}`}
                    >
                        More
                    </button>
                )}
            </div>
        </div>
    );
};

export default MovieCard;
