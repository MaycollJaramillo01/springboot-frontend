import { forwardRef } from 'react';
import type { Invoice } from '@/types/domain';
import styles from './Receipt80mm.module.css';

type Receipt80mmProps = {
  invoice: Invoice;
};

export const Receipt80mm = forwardRef<HTMLDivElement, Receipt80mmProps>(({ invoice }, ref) => {
  return (
    <div ref={ref} className={styles.ticket}>
      <h1>POS Multi-Sucursal</h1>
      <p>Factura #{invoice.number}</p>
      <p>Fecha: {new Date(invoice.createdAt).toLocaleString('es-NI')}</p>
      <p>Cliente: {invoice.customer?.name ?? 'Consumidor final'}</p>
      <hr />
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cant</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.product.id}>
              <td>{item.product.name}</td>
              <td>{item.quantity}</td>
              <td>C${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <div className={styles.totals}>
        <div>
          <span>Subtotal</span>
          <strong>C${invoice.subtotal.toFixed(2)}</strong>
        </div>
        <div>
          <span>IVA</span>
          <strong>C${invoice.tax.toFixed(2)}</strong>
        </div>
        {invoice.discount ? (
          <div>
            <span>Descuento</span>
            <strong>-C${invoice.discount.toFixed(2)}</strong>
          </div>
        ) : null}
        <div>
          <span>Total</span>
          <strong>C${invoice.total.toFixed(2)}</strong>
        </div>
      </div>
      <p className={styles.footer}>Gracias por su compra</p>
    </div>
  );
});

Receipt80mm.displayName = 'Receipt80mm';
