import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Product } from '@/types/domain';
import { DataTable } from '@/components/DataTable';
import styles from './Products.module.css';

interface ProductPage {
  content: Product[];
  totalPages: number;
  page: number;
  totalElements: number;
}

export default function Products() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const { data, isFetching } = useQuery({
    queryKey: ['products', page, search],
    queryFn: async () => {
      const response = await http.get<ProductPage>('/api/products', {
        params: { page, search, size: 10 }
      });
      return response.data;
    }
  });

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h2>Productos</h2>
        <input
          type="search"
          placeholder="Buscar"
          value={search}
          onChange={(event) => {
            setPage(0);
            setSearch(event.target.value);
          }}
        />
      </header>
      <DataTable
        data={data?.content ?? []}
        isLoading={isFetching}
        emptyState="No se encontraron productos"
        columns={[
          { key: 'sku', header: 'SKU' },
          { key: 'name', header: 'Nombre' },
          { key: 'category', header: 'Categoría' },
          {
            key: 'salePrice',
            header: 'Precio',
            render: (product) => `C$${product.salePrice.toFixed(2)}`
          },
          {
            key: 'stock',
            header: 'Stock',
            render: (product) => (product.stock > 0 ? product.stock : 'Sin stock')
          }
        ]}
      />
      <footer className={styles.pagination}>
        <button type="button" onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
          Anterior
        </button>
        <span>
          Página {page + 1} de {data?.totalPages ?? 1}
        </span>
        <button
          type="button"
          onClick={() => setPage((prev) => (data && prev + 1 < data.totalPages ? prev + 1 : prev))}
          disabled={data ? page + 1 >= data.totalPages : true}
        >
          Siguiente
        </button>
      </footer>
    </div>
  );
}
