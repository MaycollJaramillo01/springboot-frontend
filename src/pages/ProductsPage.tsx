import { useEffect, useState } from 'react';
import ProductGrid from '../components/pos/ProductGrid';
import SearchInput from '../components/common/SearchInput';
import CategoryPills from '../components/catalog/CategoryPills';
import { useCatalogStore } from '../store/catalogStore';
import StatusBanner from '../components/common/StatusBanner';
import { useCartStore } from '../store/cartStore';

const ProductsPage = () => {
  const catalog = useCatalogStore();
  const addToCart = useCartStore((state) => state.addItem);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<number | null>(null);

  useEffect(() => {
    void catalog.refresh();
  }, []);

  const products = catalog.products.filter((product) => {
    const matchesSearch = `${product.name} ${product.sku}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category ? product.categoryId === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <header>
        <h1 style={{ margin: '0 0 8px' }}>Productos</h1>
        <p style={{ margin: 0, color: '#475569' }}>
          Consulta el catálogo disponible y sincronizado con el backend.
        </p>
      </header>
      {catalog.error && <StatusBanner tone="danger" title="Error" description={catalog.error} />}
      {catalog.loading && !catalog.products.length && <p>Cargando productos…</p>}
      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre o SKU" />
      <CategoryPills categories={catalog.categories} activeId={category} onSelect={setCategory} />
      <ProductGrid products={products} onAdd={addToCart} />
    </div>
  );
};

export default ProductsPage;
