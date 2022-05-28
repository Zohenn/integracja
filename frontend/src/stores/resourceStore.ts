import axios from 'axios';
import create from 'zustand';

export type Resources = 'oil' | 'naturalgas' | 'gold';

export interface Resource {
  name: string;
  minDate: Date;
  maxDate: Date;
}

export interface ResourceDataEntry {
  date: Date;
  price: number;
}

interface ResourceStore {
  initialized: boolean;
  resources: { [k in Resources]?: Resource };

  init: () => Promise<void>;
}

const resourceKeys: Resources[] = ['naturalgas'];

export const useResourceStore = create<ResourceStore>((set, get) => ({
  initialized: false,
  resources: {
    oil: undefined,
    naturalgas: undefined,
  },

  init: async () => {
    if (get().initialized) {
      return;
    }

    const resources: ResourceStore["resources"] = {};

    await Promise.all(resourceKeys.map(async (resource) => {
      const response = await axios.get<Resource>(`/api/rest/${resource}/info`);
      response.data.minDate = new Date(response.data.minDate);
      response.data.maxDate = new Date(response.data.maxDate);
      resources[resource] = response.data;
    }));

    set({ initialized: true, resources });
  }
}));
