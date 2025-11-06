import type { Product } from '../../types/api';

export type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

const ProductCard = ({ product, onAdd }: ProductCardProps) => (
  <button
    type="button"
    onClick={() => onAdd(product)}
    className="product-card"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '8px',
      padding: '16px',
      borderRadius: '16px',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      background: '#fff',
      boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
      minHeight: 140,
      cursor: 'pointer',
      transition: 'transform 0.15s ease, box-shadow 0.2s ease',
      width: '100%'
    }}
  >
    <strong style={{ fontSize: '1rem' }}>{product.name}</strong>
    <span style={{ color: '#475569' }}>{product.sku}</span>
    <span style={{ marginTop: 'auto', fontWeight: 600, fontSize: '1.1rem' }}>
      {product.unitPrice.value.toLocaleString('es-CO', {
        style: 'currency',
        currency: product.unitPrice.currency
      })}
    </span>
  </button>
);

export default ProductCard;
