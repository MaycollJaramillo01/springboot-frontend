import type { SaleResponse } from '../../types/api';

export const printTicket = (sale: SaleResponse) => {
  const printWindow = window.open('', 'PRINT', 'height=600,width=400');
  if (!printWindow) {
    // eslint-disable-next-line no-alert
    alert('No fue posible abrir la ventana de impresión. Permite los popups.');
    return;
  }

  const { invoice } = sale;
  const styles = `
    <style>
      body { font-family: monospace; width: 80mm; margin: 0; }
      h1, h2, h3 { margin: 0; }
      hr { border: none; border-top: 1px dashed #000; margin: 12px 0; }
      .line { display: flex; justify-content: space-between; }
      .center { text-align: center; }
    </style>
  `;
  const lines = invoice.lines
    .map(
      (line) => `
        <div>
          <div class="line">
            <span>Producto #${line.productId}</span>
            <span>${line.unitPrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
          </div>
          <div class="line">
            <small>Cant: ${line.quantity}</small>
            <small>Total: ${(line.unitPrice * line.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</small>
          </div>
        </div>
      `
    )
    .join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>Factura ${invoice.invoiceNumber}</title>
        ${styles}
      </head>
      <body>
        <section class="center">
          <h2>POS Touch</h2>
          <p>Factura #${invoice.invoiceNumber}</p>
          <small>${new Date(invoice.issuedAt).toLocaleString('es-CO')}</small>
        </section>
        <hr />
        ${lines}
        <hr />
        <div class="line"><span>Subtotal</span><span>${invoice.subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span></div>
        <div class="line"><span>Impuestos</span><span>${invoice.taxTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span></div>
        <div class="line"><strong>Total</strong><strong>${invoice.grandTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</strong></div>
        <hr />
        <p class="center">¡Gracias por tu compra!</p>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};
