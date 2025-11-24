// Cliente HTTP básico (puede reemplazarse con axios, fetch wrapper, etc.)
export async function httpClient<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
    }
    return (await res.json()) as T;
}
