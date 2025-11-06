import { create } from 'zustand';
import type { Category, PaginatedProducts, Product, SearchQuery } from '../types/api';
import { fetchCategories, fetchProducts, syncAll } from '../lib/api';
import {
  loadCatalogFromDB,
  persistSyncEnvelope,
  loadMetadata
} from '../lib/db/indexedDB';

export type CatalogState = {
  products: Product[];
  categories: Category[];
  pagination: PaginatedProducts['pagination'];
  loading: boolean;
  error: string | null;
  lastSync?: string;
  initialize: () => Promise<void>;
  refresh: (query?: Partial<SearchQuery>) => Promise<void>;
  search: (query: Partial<SearchQuery>) => Promise<void>;
};

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: [],
  categories: [],
  pagination: { page: 0, size: 20 },
  loading: false,
  error: null,
  initialize: async () => {
    set({ loading: true });
    try {
      const offline = await loadCatalogFromDB();
      if (offline.products.length) {
        set({
          products: offline.products,
          categories: offline.categories,
          loading: false
        });
      }
      const metadata = await loadMetadata();
      set({ lastSync: metadata?.lastSync });
      await get().refresh();
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : String(error) });
    }
  },
  refresh: async (query = {}) => {
    set({ loading: true, error: null });
    const [productResult, categoryResult, syncResult] = await Promise.all([
      fetchProducts(query),
      fetchCategories(),
      syncAll()
    ]);

    if (productResult.error) {
      set({ loading: false, error: productResult.error.message ?? 'Error al cargar productos.' });
      return;
    }

    if (categoryResult.error) {
      set({ loading: false, error: categoryResult.error.message ?? 'Error al cargar categorías.' });
      return;
    }

    if (!productResult.data) {
      set({ loading: false, error: 'No se recibieron datos de productos.' });
      return;
    }

    if (!categoryResult.data) {
      set({ loading: false, error: 'No se recibieron datos de categorías.' });
      return;
    }

    if (!syncResult.error && syncResult.data) {
      await persistSyncEnvelope(syncResult.data);
      set({ lastSync: syncResult.data.updatedAt });
    }

    set({
      products: productResult.data.content,
      categories: categoryResult.data,
      pagination: productResult.data.pagination,
      loading: false,
      error: null
    });
  },
  search: async (query) => {
    set({ loading: true, error: null });
    const result = await fetchProducts(query);
    if (result.error || !result.data) {
      set({
        loading: false,
        error: result.error?.message ?? 'No fue posible obtener el catálogo.'
      });
      return;
    }
    set({
      products: result.data.content,
      pagination: result.data.pagination,
      loading: false
    });
  }
}));
