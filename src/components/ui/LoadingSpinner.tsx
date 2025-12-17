import React from 'react';
import { Spinner, SpinnerProps } from 'react-bootstrap';

interface LoadingSpinnerProps {
    size?: SpinnerProps["size"];
    variant?: SpinnerProps["variant"];
    text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size,
    variant = 'primary',
    text = 'Cargando...'
}) => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center p-4">
            <Spinner animation="border" variant={variant} size={size as "sm" | undefined} />
            {text && <p className="mt-2 text-white">{text}</p>}
        </div>
    );
};
