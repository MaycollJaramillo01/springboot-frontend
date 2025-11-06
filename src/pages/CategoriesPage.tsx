import { useEffect } from 'react';
import { useCatalogStore } from '../store/catalogStore';
import StatusBanner from '../components/common/StatusBanner';

const CategoriesPage = () => {
  const catalog = useCatalogStore();

  useEffect(() => {
    void catalog.refresh();
  }, []);

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <header>
        <h1 style={{ margin: '0 0 8px' }}>Categorías</h1>
        <p style={{ margin: 0, color: '#475569' }}>
          Clasifica tus productos y optimiza la búsqueda en el punto de venta.
        </p>
      </header>
      {catalog.error && <StatusBanner tone="danger" title="Error" description={catalog.error} />}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 18
        }}
      >
        {catalog.categories.map((category) => (
          <article
            key={category.id}
            style={{
              padding: '18px',
              borderRadius: '18px',
              background: category.color ?? 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
              color: '#0f172a',
              boxShadow: '0 18px 32px rgba(15, 23, 42, 0.12)'
            }}
          >
            <h3 style={{ margin: '0 0 6px' }}>{category.name}</h3>
            <p style={{ margin: 0 }}>{category.description ?? 'Sin descripción'}</p>
          </article>
        ))}
        {!catalog.categories.length && <p>No hay categorías disponibles.</p>}
      </div>
    </div>
  );
};

export default CategoriesPage;
