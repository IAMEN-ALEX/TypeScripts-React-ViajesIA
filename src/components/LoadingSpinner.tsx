import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
    size?: 'sm' | 'lg';
    variant?: string;
    text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size,
    variant = 'primary',
    text = 'Cargando...'
}) => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center p-4">
            <Spinner animation="border" variant={variant} size={size} />
            {text && <p className="mt-2 text-white">{text}</p>}
        </div>
    );
};
