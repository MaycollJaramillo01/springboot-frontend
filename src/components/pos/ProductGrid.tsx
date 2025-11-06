import type { Product } from '../../types/api';
import ProductCard from './ProductCard';

export type ProductGridProps = {
  products: Product[];
  onAdd: (product: Product) => void;
};

const ProductGrid = ({ products, onAdd }: ProductGridProps) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '16px',
      paddingBottom: '120px'
    }}
  >
    {products.map((product) => (
      <ProductCard key={product.id} product={product} onAdd={onAdd} />
    ))}
    {!products.length && (
      <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#475569' }}>
        No se encontraron productos.
      </p>
    )}
  </div>
);

export default ProductGrid;
