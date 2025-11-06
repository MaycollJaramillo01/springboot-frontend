import type { AxiosError } from 'axios';
import apiClient, { mapAxiosError } from './client';
import { API_ROUTES } from './routes';
import {
  adaptCategory,
  adaptCustomer,
  adaptCustomerPage,
  adaptInvoice,
  adaptProduct,
  adaptProductPage,
  adaptSaleResponse,
  adaptSyncEnvelope
} from './adapters';
import type {
  ApiResult,
  Category,
  Customer,
  Invoice,
  PaginatedCustomers,
  PaginatedProducts,
  SaleRequest,
  SaleResponse,
  SearchQuery,
  SyncEnvelope
} from '../../types/api';
import { ApiErrorSchema } from '../../types/api';

const handleRequest = async <T>(fn: () => Promise<T>): Promise<ApiResult<T>> => {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    const mapped = mapAxiosError(error as AxiosError);
    return { data: null, error: mapped };
  }
};

export const fetchProducts = async (
  query: Partial<SearchQuery> = {}
): Promise<ApiResult<PaginatedProducts>> =>
  handleRequest(async () => {
    const response = await apiClient.get(API_ROUTES.products, { params: query });
    const content = Array.isArray(response.data?.content)
      ? response.data.content.map((item: unknown) => adaptProduct(item))
      : [];
    const size = response.data?.size ?? query.size ?? 20;
    return adaptProductPage({
      content,
      pagination: {
        page: response.data?.page ?? 0,
        size: Math.max(1, size),
        totalElements: response.data?.totalElements,
        totalPages: response.data?.totalPages,
        last: response.data?.last
      }
    });
  });

export const fetchCategories = async (): Promise<ApiResult<Category[]>> =>
  handleRequest(async () => {
    const response = await apiClient.get(API_ROUTES.categories);
    return Array.isArray(response.data)
      ? response.data.map((category: unknown) => adaptCategory(category))
      : [];
  });

export const fetchCustomers = async (
  query: Partial<SearchQuery> = {}
): Promise<ApiResult<PaginatedCustomers>> =>
  handleRequest(async () => {
    const response = await apiClient.get(API_ROUTES.customers, { params: query });
    const content = Array.isArray(response.data?.content)
      ? response.data.content.map((item: unknown) => adaptCustomer(item))
      : [];
    const size = response.data?.size ?? query.size ?? 20;
    return adaptCustomerPage({
      content,
      pagination: {
        page: response.data?.page ?? 0,
        size: Math.max(1, size),
        totalElements: response.data?.totalElements,
        totalPages: response.data?.totalPages,
        last: response.data?.last
      }
    });
  });

export const fetchInvoices = async (): Promise<ApiResult<Invoice[]>> =>
  handleRequest(async () => {
    const response = await apiClient.get(API_ROUTES.invoices);
    return Array.isArray(response.data)
      ? response.data.map((invoice: unknown) => adaptInvoice(invoice))
      : [];
  });

export const syncAll = async (): Promise<ApiResult<SyncEnvelope>> =>
  handleRequest(async () => {
    const response = await apiClient.get(API_ROUTES.sync);
    return adaptSyncEnvelope(response.data);
  });

export const submitSale = async (
  payload: SaleRequest
): Promise<ApiResult<SaleResponse>> =>
  handleRequest(async () => {
    const response = await apiClient.post(API_ROUTES.sales, payload);
    return adaptSaleResponse(response.data);
  });

export const extractMessage = (error: unknown): string => {
  const parsed = ApiErrorSchema.safeParse(error);
  if (parsed.success) {
    return parsed.data.message ?? 'Ocurrió un error inesperado.';
  }
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: string }).message);
  }
  return 'Ocurrió un error inesperado.';
};
