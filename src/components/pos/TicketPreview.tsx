import type { SaleResponse } from '../../types/api';

export type TicketPreviewProps = {
  sale?: SaleResponse | null;
};

const TicketPreview = ({ sale }: TicketPreviewProps) => {
  if (!sale) return null;

  const { invoice } = sale;

  return (
    <article className="ticket" style={{ fontFamily: 'monospace', width: 280 }}>
      <header style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>POS Touch</h2>
        <p style={{ margin: 0 }}>Factura #{invoice.invoiceNumber}</p>
        <small>{new Date(invoice.issuedAt).toLocaleString('es-CO')}</small>
      </header>
      <hr />
      <section>
        {invoice.lines.map((line) => (
          <div key={`${line.productId}-${line.unitPrice}`} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Producto #{line.productId}</span>
              <span>{line.unitPrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
            </div>
            <small>
              Cantidad: {line.quantity} — Total:
              {(line.quantity * line.unitPrice).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
            </small>
          </div>
        ))}
      </section>
      <hr />
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal</span>
          <span>{invoice.subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Impuestos</span>
          <span>{invoice.taxTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Total</strong>
          <strong>{invoice.grandTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</strong>
        </div>
      </section>
      <hr />
      <footer style={{ textAlign: 'center', marginTop: 12 }}>
        <p style={{ margin: 0 }}>¡Gracias por tu compra!</p>
      </footer>
    </article>
  );
};

export default TicketPreview;
