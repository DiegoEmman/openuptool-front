// Punto de entrada para estado global (Redux / Zustand / Jotai / etc.)
export interface GlobalState {
    version: string;
}

export const initialState: GlobalState = {
    version: '0.0.1',
};
