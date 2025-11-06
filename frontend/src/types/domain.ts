import type { components } from '@/types/openapi';

export type Product = components['schemas']['ProductResponse'];
export type Customer = components['schemas']['CustomerResponse'];
export type Invoice = components['schemas']['InvoiceResponse'];
export type PaymentMethod = components['schemas']['PaymentMethodResponse'];

export type CartItem = {
  product: Product;
  quantity: number;
  discount?: number;
};
