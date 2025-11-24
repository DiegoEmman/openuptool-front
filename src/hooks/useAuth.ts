import { useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulación de auth async
        const timer = setTimeout(() => {
            setUser({ id: '1', email: 'demo@example.com' });
            setLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, []);

    return { user, loading };
}
