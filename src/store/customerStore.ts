import { create } from 'zustand';
import type { Customer, PaginatedCustomers, SearchQuery } from '../types/api';
import { fetchCustomers } from '../lib/api';
import { loadCatalogFromDB } from '../lib/db/indexedDB';

export type CustomerState = {
  customers: Customer[];
  pagination: PaginatedCustomers['pagination'];
  loading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  search: (query: Partial<SearchQuery>) => Promise<void>;
};

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  pagination: { page: 0, size: 20 },
  loading: false,
  error: null,
  initialize: async () => {
    set({ loading: true });
    try {
      const offline = await loadCatalogFromDB();
      if (offline.customers.length) {
        set({ customers: offline.customers, loading: false });
      }
      const result = await fetchCustomers({ page: 0, size: 50 });
      if (result.data) {
        set({
          customers: result.data.content,
          pagination: result.data.pagination,
          loading: false,
          error: null
        });
      } else if (result.error) {
        set({ loading: false, error: result.error.message ?? 'No fue posible cargar los clientes.' });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : String(error) });
    }
  },
  search: async (query) => {
    set({ loading: true, error: null });
    const result = await fetchCustomers(query);
    if (result.error || !result.data) {
      set({
        loading: false,
        error: result.error?.message ?? 'No fue posible cargar los clientes.'
      });
      return;
    }
    set({
      customers: result.data.content,
      pagination: result.data.pagination,
      loading: false
    });
  }
}));
