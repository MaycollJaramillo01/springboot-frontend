import { z } from 'zod';

export const ApiErrorSchema = z.object({
  timestamp: z.string().optional(),
  status: z.number().default(500),
  error: z.string().optional(),
  message: z.string().optional(),
  path: z.string().optional()
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const PaginationSchema = z.object({
  page: z.number().nonnegative().default(0),
  size: z.number().nonnegative().default(20),
  totalElements: z.number().nonnegative().optional(),
  totalPages: z.number().nonnegative().optional(),
  last: z.boolean().optional()
});

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string().optional()
});
export type Category = z.infer<typeof CategorySchema>;

export const PriceSchema = z.object({
  currency: z.string().default('USD'),
  value: z.number().nonnegative(),
  taxIncluded: z.boolean().default(true)
});

export const ProductSchema = z.object({
  id: z.number(),
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  categoryId: z.number(),
  unitPrice: PriceSchema,
  stockQuantity: z.number().nonnegative().optional(),
  barcode: z.string().optional()
});
export type Product = z.infer<typeof ProductSchema>;

export const CustomerSchema = z.object({
  id: z.number(),
  documentNumber: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  loyaltyPoints: z.number().nonnegative().optional()
});
export type Customer = z.infer<typeof CustomerSchema>;

export const PaymentMethodSchema = z.enum([
  'CASH',
  'CARD',
  'TRANSFER',
  'MOBILE',
  'MIXED'
]);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const InvoiceLineSchema = z.object({
  productId: z.number(),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  taxRate: z.number().default(0),
  discount: z.number().default(0)
});
export type InvoiceLine = z.infer<typeof InvoiceLineSchema>;

export const InvoiceSchema = z.object({
  id: z.number(),
  invoiceNumber: z.string(),
  issuedAt: z.string(),
  customerId: z.number().nullable(),
  lines: z.array(InvoiceLineSchema),
  subtotal: z.number(),
  taxTotal: z.number(),
  grandTotal: z.number(),
  paymentMethod: PaymentMethodSchema,
  status: z.enum(['DRAFT', 'ISSUED', 'CANCELLED']).default('ISSUED')
});
export type Invoice = z.infer<typeof InvoiceSchema>;

export const SaleRequestSchema = z.object({
  customerId: z.number().optional(),
  paymentMethod: PaymentMethodSchema,
  lines: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().positive(),
      unitPrice: z.number().nonnegative(),
      discount: z.number().nonnegative().default(0)
    })
  ),
  notes: z.string().optional()
});
export type SaleRequest = z.infer<typeof SaleRequestSchema>;

export const SaleResponseSchema = z.object({
  invoice: InvoiceSchema,
  message: z.string().optional()
});
export type SaleResponse = z.infer<typeof SaleResponseSchema>;

export const SearchQuerySchema = z.object({
  query: z.string().default(''),
  categoryId: z.number().optional(),
  page: z.number().nonnegative().default(0),
  size: z.number().positive().default(20)
});
export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export const PaginatedProductsSchema = z.object({
  content: z.array(ProductSchema),
  pagination: PaginationSchema
});
export type PaginatedProducts = z.infer<typeof PaginatedProductsSchema>;

export const PaginatedCustomersSchema = z.object({
  content: z.array(CustomerSchema),
  pagination: PaginationSchema
});
export type PaginatedCustomers = z.infer<typeof PaginatedCustomersSchema>;

export const SyncEnvelopeSchema = z.object({
  updatedAt: z.string(),
  products: z.array(ProductSchema),
  categories: z.array(CategorySchema),
  customers: z.array(CustomerSchema)
});
export type SyncEnvelope = z.infer<typeof SyncEnvelopeSchema>;

export type ApiResult<T> = {
  data: T | null;
  error: ApiError | null;
};
