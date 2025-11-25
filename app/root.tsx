import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from 'react-router';
import type { Route } from './+types/root';
import './app.css';
import { AppProviders } from '../src/app/AppProviders';

export const links: Route.LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;400;600;700&display=swap',
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <AppProviders>{children}</AppProviders>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = 'Error';
    let details = 'Ha ocurrido un error inesperado.';
    let stack: string | undefined;
    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details = error.status === 404 ? 'Página no encontrada.' : error.statusText || details;
    } else if (import.meta.env.DEV && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }
    return (
        <main style={{ padding: 32 }}>
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
