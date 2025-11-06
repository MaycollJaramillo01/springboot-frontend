import { z } from 'zod';
import {
  CategorySchema,
  CustomerSchema,
  InvoiceSchema,
  PaginatedCustomersSchema,
  PaginatedProductsSchema,
  ProductSchema,
  SaleResponseSchema,
  SyncEnvelopeSchema,
  type Category,
  type Customer,
  type Invoice,
  type PaginatedCustomers,
  type PaginatedProducts,
  type Product,
  type SaleResponse,
  type SyncEnvelope
} from '../../types/api';

const safeParse = <T>(schema: z.ZodSchema<T>, payload: unknown, label: string): T => {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error(`[API][Adapters] No se pudo validar la respuesta para ${label}`, parsed.error);
    throw parsed.error;
  }

  return parsed.data;
};

export const adaptProduct = (payload: unknown): Product =>
  safeParse(ProductSchema, payload, 'Producto');

export const adaptCategory = (payload: unknown): Category =>
  safeParse(CategorySchema, payload, 'Categoría');

export const adaptCustomer = (payload: unknown): Customer =>
  safeParse(CustomerSchema, payload, 'Cliente');

export const adaptInvoice = (payload: unknown): Invoice =>
  safeParse(InvoiceSchema, payload, 'Factura');

export const adaptProductPage = (payload: unknown): PaginatedProducts =>
  safeParse(PaginatedProductsSchema, payload, 'Listado de productos');

export const adaptCustomerPage = (payload: unknown): PaginatedCustomers =>
  safeParse(PaginatedCustomersSchema, payload, 'Listado de clientes');

export const adaptSaleResponse = (payload: unknown): SaleResponse =>
  safeParse(SaleResponseSchema, payload, 'Respuesta de venta');

export const adaptSyncEnvelope = (payload: unknown): SyncEnvelope =>
  safeParse(SyncEnvelopeSchema, payload, 'Sobre de sincronización');
