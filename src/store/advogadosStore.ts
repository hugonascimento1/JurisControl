import { create } from 'zustand';

interface AdvogadoLista {
  id: number;
  nome: string;
  email: string;
  senha: string;
  registroOAB: string;
}

interface AdvogadosState {
  advogados: AdvogadoLista[];
  lastFetched: number | null;
  setAdvogados: (advs: AdvogadoLista[]) => void; 
  clearAdvogados: () => void; 
}

export const useAdvogadosStore = create<AdvogadosState>((set) => ({
  advogados: [],
  lastFetched: null,
  setAdvogados: (advs) => set(() => ({ advogados: advs, lastFetched: Date.now() })),
  clearAdvogados: () => set({ advogados: [], lastFetched: null }),
}));