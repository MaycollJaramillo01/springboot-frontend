import { create } from 'zustand';
import type { Invoice } from '../types/api';
import { fetchInvoices } from '../lib/api';
import { loadInvoicesFromDB, saveInvoiceToDB } from '../lib/db/indexedDB';

export type InvoiceState = {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
  addInvoice: (invoice: Invoice) => Promise<void>;
};

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  loading: false,
  error: null,
  initialize: async () => {
    set({ loading: true });
    const offline = await loadInvoicesFromDB();
    if (offline.length) {
      set({ invoices: offline, loading: false });
    }
    await get().refresh();
  },
  refresh: async () => {
    set({ loading: true, error: null });
    const result = await fetchInvoices();
    if (result.error || !result.data) {
      set({
        loading: false,
        error: result.error?.message ?? 'No fue posible obtener las facturas.'
      });
      return;
    }
    set({ invoices: result.data, loading: false });
  },
  addInvoice: async (invoice) => {
    await saveInvoiceToDB(invoice);
    set({ invoices: [invoice, ...get().invoices] });
  }
}));
