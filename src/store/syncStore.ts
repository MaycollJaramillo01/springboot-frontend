import { create } from 'zustand';
import type { SaleRequest, SaleResponse } from '../types/api';
import {
  clearOfflineSales,
  loadOfflineSales,
  persistOfflineSaleResult,
  queueOfflineSale
} from '../lib/db/indexedDB';
import { submitSale } from '../lib/api';

export type SyncState = {
  pendingSales: { sale: SaleRequest; createdAt: string }[];
  syncing: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  enqueueSale: (sale: SaleRequest) => Promise<void>;
  processQueue: () => Promise<void>;
};

export const useSyncStore = create<SyncState>((set, get) => ({
  pendingSales: [],
  syncing: false,
  error: null,
  initialize: async () => {
    const pendingSales = await loadOfflineSales();
    set({ pendingSales });
  },
  enqueueSale: async (sale) => {
    await queueOfflineSale(sale);
    set({ pendingSales: [...get().pendingSales, { sale, createdAt: new Date().toISOString() }] });
  },
  processQueue: async () => {
    if (!get().pendingSales.length) return;
    set({ syncing: true, error: null });
    const results: SaleResponse[] = [];
    const errors: string[] = [];

    for (const item of get().pendingSales) {
      const response = await submitSale(item.sale);
      if (response.data) {
        results.push(response.data);
        await persistOfflineSaleResult(response.data);
      } else if (response.error) {
        errors.push(response.error.message ?? 'No se pudo sincronizar una venta.');
      }
    }

    if (!errors.length) {
      await clearOfflineSales();
      set({ pendingSales: [], syncing: false });
    } else {
      set({ syncing: false, error: errors.join('\n') });
    }
  }
}));
