import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import { HomePage } from './pages';
import { ErrorBoundary } from './app';

// Punto de entrada (si se decide usar en lugar del sistema actual de react-router dev)
function Bootstrap() {
    return (
        <ErrorBoundary>
            <HomePage />
        </ErrorBoundary>
    );
}

const el = document.getElementById('root');
if (el) {
    createRoot(el).render(<Bootstrap />);
}
