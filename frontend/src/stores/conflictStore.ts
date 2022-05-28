import create from 'zustand';
import axios from 'axios';

export interface Conflict {
  date: Date;
  name: string;
}

interface ConflictStore {
  initialized: boolean;
  conflicts: Conflict[];

  init: () => Promise<void>;
}

export const useConflictStore = create<ConflictStore>((set, get) => ({
  initialized: false,
  conflicts: [],

  init: async () => {
    if (get().initialized) {
      return;
    }

    const response = await axios.get<Conflict[]>('/api/rest/conflicts');
    set({
      initialized: true,
      conflicts: response.data.map((conflict) => ({ ...conflict, date: new Date(conflict.date) }))
    });
  }
}));
