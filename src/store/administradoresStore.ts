import { create } from 'zustand';

interface AdministradorLista {
    id: number;
    nome: string;
    email: string;
    senha: string;
    cnpj: string;
    telefone: string;
}

interface AdministradoresState {
    administradores: AdministradorLista[];
    lastFetched: number | null;
    setAdministradores: (adms: AdministradorLista[]) => void;
    clearAdministradores: () => void; 
}

export const useAdministradoresStore = create<AdministradoresState>((set) => ({
    administradores: [],
    lastFetched: null,
    setAdministradores: (adms) => set(() => ({ administradores: adms, lastFetched: Date.now() })),
    clearAdministradores: () => set({ administradores: [], lastFetched: null }),
}));