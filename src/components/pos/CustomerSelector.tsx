import { useMemo, useState } from 'react';
import type { Customer } from '../../types/api';
import SearchInput from '../common/SearchInput';

export type CustomerSelectorProps = {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
  onSearch: (term: string) => void;
  selectedCustomer?: Customer | null;
};

const CustomerSelector = ({ customers, onSelect, onSearch, selectedCustomer }: CustomerSelectorProps) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return customers;
    return customers.filter((customer) =>
      `${customer.fullName} ${customer.documentNumber}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [customers, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch(value);
  };

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '16px',
        borderRadius: '16px',
        background: '#fff',
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.1)'
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 4px' }}>Cliente</h3>
          <p style={{ margin: 0, color: '#475569' }}>
            {selectedCustomer ? selectedCustomer.fullName : 'Selecciona un cliente'}
          </p>
        </div>
      </header>
      <SearchInput
        value={search}
        placeholder="Buscar por nombre o documento"
        onChange={handleSearch}
      />
      <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((customer) => (
          <button
            key={customer.id}
            type="button"
            onClick={() => onSelect(customer)}
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              background:
                selectedCustomer?.id === customer.id
                  ? 'linear-gradient(135deg, rgba(0, 119, 182, 0.12), rgba(0, 180, 216, 0.2))'
                  : '#f8fafc',
              textAlign: 'left'
            }}
          >
            <strong>{customer.fullName}</strong>
            <p style={{ margin: '4px 0 0', color: '#475569' }}>{customer.documentNumber}</p>
          </button>
        ))}
        {!filtered.length && <p style={{ color: '#94a3b8' }}>Sin resultados</p>}
      </div>
    </section>
  );
};

export default CustomerSelector;
