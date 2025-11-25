import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import { AppProviders } from './app/AppProviders';
import { AppRouter } from './app/router';

function Bootstrap() {
    return (
        <AppProviders>
            <AppRouter />
        </AppProviders>
    );
}

const el = document.getElementById('root');
if (el) {
    createRoot(el).render(<Bootstrap />);
}
