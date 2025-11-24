import React from 'react';

export function Loader({ size = 32 }: { size?: number }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                border: '4px solid #ccc',
                borderTopColor: '#2563eb',
                animation: 'spin 1s linear infinite',
            }}
        />
    );
}

export default Loader;
