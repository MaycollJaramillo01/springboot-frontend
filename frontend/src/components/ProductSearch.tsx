import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Product } from '@/types/domain';
import styles from './ProductSearch.module.css';
import { useCartStore } from '@/store/cart';
import { Toast } from '@/ui/Toast';

const queryKey = ['products', 'search'];

export function ProductSearch() {
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const addProduct = useCartStore((state) => state.addProduct);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'F2') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const { data, isFetching } = useQuery({
    queryKey: [...queryKey, search],
    queryFn: async () => {
      const response = await http.get<{
        content: Product[];
      }>('/api/products', {
        params: { search, size: 10 }
      });
      return response.data.content;
    },
    enabled: search.length > 2
  });

  const handleSelect = (product: Product) => {
    addProduct(product);
    setToast(`Producto ${product.name} agregado`);
    setSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="product-search">
        Buscar producto (F2)
      </label>
      <input
        id="product-search"
        ref={inputRef}
        className={styles.input}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Nombre, SKU o código de barras"
      />
      {isFetching && <div className={styles.dropdown}>Buscando...</div>}
      {!!data?.length && search.length > 2 && (
        <div className={styles.dropdown}>
          {data.map((product) => (
            <button key={product.id} type="button" className={styles.option} onClick={() => handleSelect(product)}>
              <span>
                <strong>{product.name}</strong>
                <small>{product.sku}</small>
              </span>
              <span>C${product.salePrice.toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
