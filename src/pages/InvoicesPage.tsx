import { useEffect } from 'react';
import { useInvoiceStore } from '../store/invoiceStore';
import StatusBanner from '../components/common/StatusBanner';

const InvoicesPage = () => {
  const invoices = useInvoiceStore();

  useEffect(() => {
    void invoices.initialize();
  }, []);

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <header>
        <h1 style={{ margin: '0 0 8px' }}>Facturas</h1>
        <p style={{ margin: 0, color: '#475569' }}>
          Revisar el historial de ventas emitidas desde el POS.
        </p>
      </header>
      {invoices.error && <StatusBanner tone="danger" title="Error" description={invoices.error} />}
      <div style={{ display: 'grid', gap: 12 }}>
        {invoices.invoices.map((invoice) => (
          <article
            key={invoice.id}
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: '#fff',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              display: 'grid',
              gap: 6
            }}
          >
            <strong>Factura #{invoice.invoiceNumber}</strong>
            <span>Emitida: {new Date(invoice.issuedAt).toLocaleString('es-CO')}</span>
            <span>Método de pago: {invoice.paymentMethod}</span>
            <span>
              Total: {invoice.grandTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
            </span>
            <span>Items: {invoice.lines.length}</span>
          </article>
        ))}
        {!invoices.invoices.length && <p>No hay facturas registradas.</p>}
      </div>
    </div>
  );
};

export default InvoicesPage;
