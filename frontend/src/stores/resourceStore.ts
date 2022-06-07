import axios from 'axios';
import create from 'zustand';

export type Resources = 'oil' | 'naturalgas' | 'gold' | 'grain';

export interface Resource {
  name: string;
  unit: string;
  minDate: Date;
  maxDate: Date;
  subsets?: Record<string, string>;
}

export interface BaseResourceDataEntry {
  date: Date;
}

export interface ResourceDataEntry extends BaseResourceDataEntry {
  price: number;
}

export type ResourceSubsetDataEntry = {
  [k: string]: number;
} & BaseResourceDataEntry;

interface ResourceStore {
  initialized: boolean;
  resources: { [k in Resources]?: Resource };

  init: () => Promise<void>;
  reset: () => void;
}

const resourceKeys: Resources[] = ['naturalgas', 'oil', 'gold', 'grain'];

const initialResourcesState = {
  oil: undefined,
  naturalgas: undefined,
  gold: undefined,
  grain: undefined,
};

export const useResourceStore = create<ResourceStore>((set, get) => ({
  initialized: false,
  resources: { ...initialResourcesState },

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
  },

  reset: () => {
    set({ initialized: false, resources: { ...initialResourcesState } })
  }
}));
