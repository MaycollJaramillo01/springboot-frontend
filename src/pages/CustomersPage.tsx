import { useEffect, useState } from 'react';
import { useCustomerStore } from '../store/customerStore';
import SearchInput from '../components/common/SearchInput';
import StatusBanner from '../components/common/StatusBanner';

const CustomersPage = () => {
  const customers = useCustomerStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    void customers.initialize();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void customers.search({ query: search });
    }, 200);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <header>
        <h1 style={{ margin: '0 0 8px' }}>Clientes</h1>
        <p style={{ margin: 0, color: '#475569' }}>
          Consulta el historial de clientes y su información de contacto.
        </p>
      </header>
      {customers.error && (
        <StatusBanner tone="danger" title="Error" description={customers.error} />
      )}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre, documento o correo"
      />
      <div style={{ display: 'grid', gap: 12 }}>
        {customers.customers.map((customer) => (
          <article
            key={customer.id}
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: '#fff',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              display: 'grid',
              gap: 6
            }}
          >
            <strong style={{ fontSize: '1.1rem' }}>{customer.fullName}</strong>
            <span>Documento: {customer.documentNumber}</span>
            {customer.email && <span>Correo: {customer.email}</span>}
            {customer.phone && <span>Teléfono: {customer.phone}</span>}
            {customer.loyaltyPoints != null && (
              <span>Puntos acumulados: {customer.loyaltyPoints}</span>
            )}
          </article>
        ))}
        {!customers.customers.length && <p>No hay clientes registrados.</p>}
      </div>
    </div>
  );
};

export default CustomersPage;
