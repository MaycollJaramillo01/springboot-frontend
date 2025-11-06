import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customer, PaymentMethod, Product } from '../types/api';
import {
  saveCartToDB,
  loadCartFromDB,
  type CartPersistence
} from '../lib/db/indexedDB';

export type CartItem = {
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
};

export type CartState = {
  items: CartItem[];
  customer: Customer | null;
  paymentMethod: PaymentMethod;
  notes: string;
  loading: boolean;
  initFromDB: () => Promise<void>;
  addItem: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  setCustomer: (customer: Customer | null) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setNotes: (notes: string) => void;
};

const persistCart = async (items: CartItem[]) => {
  const data: CartPersistence[] = items.map((item) => ({
    productId: item.product.id,
    product: item.product,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    discount: item.discount
  }));
  await saveCartToDB(data);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customer: null,
      paymentMethod: 'CASH',
      notes: '',
      loading: false,
      initFromDB: async () => {
        set({ loading: true });
        const persistence = await loadCartFromDB();
        const items: CartItem[] = persistence.map((entry) => ({
          product: entry.product,
          quantity: entry.quantity,
          unitPrice: entry.unitPrice,
          discount: entry.discount ?? 0
        }));
        set({ items, loading: false });
      },
      addItem: (product: Product) => {
        const existing = get().items.find((item) => item.product.id === product.id);
        let updated: CartItem[];
        if (existing) {
          updated = get().items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updated = [
            ...get().items,
            { product, quantity: 1, unitPrice: product.unitPrice.value, discount: 0 }
          ];
        }
        set({ items: updated });
        void persistCart(updated);
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const updated = get().items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        set({ items: updated });
        void persistCart(updated);
      },
      removeItem: (productId) => {
        const updated = get().items.filter((item) => item.product.id !== productId);
        set({ items: updated });
        void persistCart(updated);
      },
      clear: () => {
        set({ items: [], notes: '' });
        void persistCart([]);
      },
      setCustomer: (customer) => set({ customer }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setNotes: (notes) => set({ notes })
    }),
    {
      name: 'pos-cart',
      partialize: (state) => ({
        items: state.items,
        customer: state.customer,
        paymentMethod: state.paymentMethod,
        notes: state.notes
      })
    }
  )
);

export const useCartTotals = () =>
  useCartStore((state) => {
    const subtotal = state.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice - item.discount,
      0
    );
    const tax = subtotal * 0.12;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  });
