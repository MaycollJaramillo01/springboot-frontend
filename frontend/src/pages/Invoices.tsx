import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Invoice } from '@/types/domain';
import { DataTable } from '@/components/DataTable';
import styles from './Invoices.module.css';

interface InvoicePage {
  content: Invoice[];
  totalPages: number;
  page: number;
  totalElements: number;
}

export default function Invoices() {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const invoicesQuery = useQuery({
    queryKey: ['invoices', page, status],
    queryFn: async () => {
      const response = await http.get<InvoicePage>('/api/invoices', {
        params: { page, size: 10, status: status || undefined }
      });
      return response.data;
    }
  });

  const invoiceDetailQuery = useQuery({
    queryKey: ['invoice', selectedId],
    queryFn: async () => {
      if (!selectedId) return null;
      const response = await http.get<Invoice>(`/api/invoices/${selectedId}`);
      return response.data;
    },
    enabled: !!selectedId
  });

  useEffect(() => {
    if (!selectedId && invoicesQuery.data?.content.length) {
      setSelectedId(invoicesQuery.data.content[0].id);
    }
  }, [selectedId, invoicesQuery.data]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h2>Facturas</h2>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Todos</option>
          <option value="PAID">Pagadas</option>
          <option value="PENDING">Pendientes</option>
          <option value="CANCELLED">Canceladas</option>
        </select>
      </header>
      <div className={styles.content}>
        <div className={styles.list}>
          <DataTable
            data={invoicesQuery.data?.content ?? []}
            isLoading={invoicesQuery.isFetching}
            emptyState="No hay facturas registradas"
            columns={[
              { key: 'number', header: 'Número' },
              {
                key: 'total',
                header: 'Total',
                render: (invoice) => `C$${invoice.total.toFixed(2)}`
              },
              {
                key: 'status',
                header: 'Estado'
              },
              {
                key: 'createdAt',
                header: 'Fecha',
                render: (invoice) => new Date(invoice.createdAt).toLocaleString('es-NI')
              }
            ]}
          />
          <footer className={styles.pagination}>
            <button type="button" onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
              Anterior
            </button>
            <span>
              Página {page + 1} de {invoicesQuery.data?.totalPages ?? 1}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => (invoicesQuery.data && prev + 1 < invoicesQuery.data.totalPages ? prev + 1 : prev))}
              disabled={invoicesQuery.data ? page + 1 >= invoicesQuery.data.totalPages : true}
            >
              Siguiente
            </button>
          </footer>
        </div>
        <aside className={styles.detail}>
          <h3>Detalle</h3>
          <p>Seleccione una factura para ver el detalle.</p>
          <ul className={styles.invoiceList}>
            {invoicesQuery.data?.content.map((invoice) => (
              <li key={invoice.id}>
                <button type="button" onClick={() => setSelectedId(invoice.id)} className={selectedId === invoice.id ? styles.selected : ''}>
                  {invoice.number}
                </button>
              </li>
            ))}
          </ul>
          {invoiceDetailQuery.data && (
            <div className={styles.invoiceDetail}>
              <p><strong>Factura:</strong> {invoiceDetailQuery.data.number}</p>
              <p><strong>Cliente:</strong> {invoiceDetailQuery.data.customer?.name ?? 'Consumidor final'}</p>
              <p><strong>Total:</strong> C${invoiceDetailQuery.data.total.toFixed(2)}</p>
              <h4>Productos</h4>
              <ul>
                {invoiceDetailQuery.data.items.map((item) => (
                  <li key={item.product.id}>
                    {item.quantity}x {item.product.name} — C${item.total.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
