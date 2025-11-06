import { openDB } from 'idb';
import type {
  Category,
  Customer,
  Invoice,
  Product,
  SaleRequest,
  SaleResponse,
  SyncEnvelope
} from '../../types/api';

const POS_DB_NAME = 'pos-touch';
const POS_DB_VERSION = 1;

export type StoreKey = 'products' | 'categories' | 'customers' | 'cart' | 'invoices' | 'metadata';

export const createPosDB = async () =>
  openDB(POS_DB_NAME, POS_DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('customers')) {
        db.createObjectStore('customers', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('cart')) {
        db.createObjectStore('cart', { keyPath: 'productId' });
      }
      if (!db.objectStoreNames.contains('invoices')) {
        db.createObjectStore('invoices', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata');
      }
    }
  });

export type CartPersistence = {
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount?: number;
};

export type PosMetadata = {
  lastSync?: string;
};

export const persistSyncEnvelope = async (envelope: SyncEnvelope) => {
  const db = await createPosDB();
  const tx = db.transaction(['products', 'categories', 'customers', 'metadata'], 'readwrite');

  await Promise.all([
    ...envelope.products.map((product) => tx.objectStore('products').put(product)),
    ...envelope.categories.map((category) => tx.objectStore('categories').put(category)),
    ...envelope.customers.map((customer) => tx.objectStore('customers').put(customer)),
    tx.objectStore('metadata').put({ lastSync: envelope.updatedAt }, 'sync')
  ]);

  await tx.done;
};

export const loadCatalogFromDB = async () => {
  const db = await createPosDB();
  const [products, categories, customers] = await Promise.all([
    db.getAll('products'),
    db.getAll('categories'),
    db.getAll('customers')
  ]);
  return { products, categories, customers } as {
    products: Product[];
    categories: Category[];
    customers: Customer[];
  };
};

export const loadCartFromDB = async (): Promise<CartPersistence[]> => {
  const db = await createPosDB();
  return db.getAll('cart');
};

export const saveCartToDB = async (cart: CartPersistence[]) => {
  const db = await createPosDB();
  const tx = db.transaction('cart', 'readwrite');
  await tx.store.clear();
  await Promise.all(cart.map((item) => tx.store.put(item)));
  await tx.done;
};

export const saveInvoiceToDB = async (invoice: Invoice) => {
  const db = await createPosDB();
  await db.put('invoices', invoice);
};

export const loadInvoicesFromDB = async (): Promise<Invoice[]> => {
  const db = await createPosDB();
  return db.getAll('invoices');
};

export const loadMetadata = async (): Promise<PosMetadata | undefined> => {
  const db = await createPosDB();
  return db.get('metadata', 'sync');
};

export const queueOfflineSale = async (sale: SaleRequest) => {
  const db = await createPosDB();
  const queue = (await db.get('metadata', 'pending-sales')) ?? [];
  queue.push({ sale, createdAt: new Date().toISOString() });
  await db.put('metadata', queue, 'pending-sales');
};

export const loadOfflineSales = async (): Promise<
  { sale: SaleRequest; createdAt: string }[]
> => {
  const db = await createPosDB();
  return (await db.get('metadata', 'pending-sales')) ?? [];
};

export const clearOfflineSales = async () => {
  const db = await createPosDB();
  await db.delete('metadata', 'pending-sales');
};

export const persistOfflineSaleResult = async (result: SaleResponse) => {
  await saveInvoiceToDB(result.invoice);
};
