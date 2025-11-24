import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: unknown) {
        // Aquí se puede integrar logging (Sentry, etc.)
        console.error('Captured error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <main style={{ padding: 32 }}>
                    <h1>Ha ocurrido un error</h1>
                    <p>{this.state.error?.message || 'Falla inesperada'}</p>
                </main>
            );
        }
        return this.props.children;
    }
}
